import { Collection } from 'discord.js';
import { Manager, Condition, Plugin, ConditionData } from '@itsmybot';
import { Context, Variable, Config } from '@contracts';

import { AboveMembersCondition } from './impl/aboveMembers.js';
import { BellowMembersCondition } from './impl/bellowMembers.js';
import { ContentCondition } from './impl/content.js';
import { ContentContainsCondition } from './impl/contentContains.js';
import { ExpressionCondition } from './impl/expression.js';
import { IsBotCondition } from './impl/isBot.js';
import { HasRoleCondition } from './impl/hasRole.js';

export class ConditionHandler {
  manager: Manager;
  conditions: Collection<string, Condition<Plugin | undefined>>;

  constructor(manager: Manager) {
    this.manager = manager;
    this.conditions = new Collection();
  }

  registerCondition(id: string, condition: Condition<Plugin | undefined>) {
    if (this.conditions.has(id)) return condition.logger.warn(`Condition ${id} is already registered`);

    this.conditions.set(id, condition);
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
      this.manager.logger.warn(`No condition found for ID: ${conditionData.id}`);
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

  initialize() {
    this.registerCondition("aboveMembers", new AboveMembersCondition(this.manager));
    this.registerCondition("bellowMembers", new BellowMembersCondition(this.manager));
    this.registerCondition("content", new ContentCondition(this.manager));
    this.registerCondition("contentContains", new ContentContainsCondition(this.manager));
    this.registerCondition("expression", new ExpressionCondition(this.manager));
    this.registerCondition("isBot", new IsBotCondition(this.manager));
    this.registerCondition("hasRole", new HasRoleCondition(this.manager));
  }
}