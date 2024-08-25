import EngineService from './engineService.js';
import { Logger } from '@utils';
import { Config, ActionScript } from '@itsmybot';
import { Context, Variable } from '@contracts';
import { ScriptCondition } from './actionScript.js';

export class CustomCommand {
  data: Config;
  conditions: ScriptCondition[];
  actions: ActionScript[];
  logger: Logger;
  engine: EngineService;

  constructor(data: Config, logger: Logger, engine: EngineService) {
    this.logger = logger;
    this.engine = engine
    this.data = data;

    this.conditions = this.loadConditions(data.getSubsectionsOrNull("conditions"))
    this.actions = data.getSubsections("actions").map((actionData: Config) => new ActionScript(actionData, logger, engine));
  }

  private loadConditions(conditions: Config[] | undefined): ScriptCondition[] {
    if (!conditions) return [];

    return conditions.map(condition => {
      const id = condition.getString("id");
      const args = condition.getSubsection("args");
      const notMetActions = condition.has("args.not-met-actions") ? condition.getSubsections("args.not-met-actions").map((actionData: Config) => new ActionScript(actionData, this.logger, this.engine)) : [];

      return { id, args, notMetActions }
    })
  }

  async run(context: Context, variables: Variable[]) {
    if (!await this.meetsConditions(context, variables)) return;

    this.actions.forEach(action => action.run(context, variables));
  }

  async meetsConditions(context: Context, variables: Variable[]): Promise<boolean> {
    if (!this.conditions) return true;

    for (const condition of this.conditions) {
      const isMet = await this.engine.condition!.isConditionMet(condition, this, context, variables);

      if (!isMet) return false;
    }

    return true;
  }
}