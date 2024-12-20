import { Collection } from 'discord.js';
import { Condition, Plugin, ConditionData, Manager } from '@itsmybot';
import { Context, Variable, Config } from '@contracts';
import { sync } from 'glob';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export class ConditionHandler {
  manager: Manager;
  conditions: Collection<string, Condition<Plugin | undefined>>;

  constructor(manager: Manager) {
    this.manager = manager;
    this.conditions = new Collection();
  }

  async initialize() {
    await this.registerFromDir(join(dirname(fileURLToPath(import.meta.url)), 'impl'))
  }

  async registerFromDir(conditionsDir: string, plugin: Plugin | undefined = undefined) {
    const conditionFiles = sync(join(conditionsDir, '**', '*.js'));

    for (const filePath of conditionFiles) {
      const conditionPath = new URL('file://' + filePath.replace(/\\/g, '/')).href;
      const { default: condition } = await import(conditionPath);

      this.registerCondition(new condition(this.manager, plugin));
    };
  }

  registerCondition(condition: Condition<Plugin | undefined>) {
    if (this.conditions.has(condition.id)) return condition.logger.warn(`Condition ${condition.id} is already registered`);

    this.conditions.set(condition.id, condition);
  }

  buildConditions(conditions: Config[], notMetAction: boolean = true): ConditionData[] {
    return conditions.map(condition => new ConditionData(this.manager.services.engine, condition, notMetAction));
  }

  async meetsConditions(conditions: ConditionData[], context: Context, variables: Variable[]): Promise<boolean> {
    if (!conditions) return true;

    for (const condition of conditions) {
      const isMet = await this.isConditionMet(condition, context, variables);

      if (!isMet) return false;
    }

    return true;
  }

  async isConditionMet(conditionData: ConditionData, context: Context, variables: Variable[]) {
    const condition = this.conditions.get(conditionData.id);
    if (!condition) {
      conditionData.logger.warn(`No condition found for ID: ${conditionData.id}`);
      return false;
    }

    let isMet = await condition.isMet(conditionData, context, variables);

    if (conditionData.args.getBoolOrNull("inverse")) {
      isMet = !isMet;
    }

    if (!isMet) {
      conditionData.notMetActions.forEach(subAction => subAction.run(context, variables));
    }

    return isMet;
  }
}