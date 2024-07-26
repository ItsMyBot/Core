import EngineService from './engineService.js';
import { Logger } from '@utils';
import { Config, ActionScript } from '@itsmybot';
import { Context, Variable } from '@contracts';

export class CustomCommand {
  data: Config;
  conditions?: Config[];
  actions: ActionScript[];
  logger: Logger;
  engine: EngineService;

  constructor(data: Config, logger: Logger, engine: EngineService) {
    this.logger = logger;
    this.engine = engine
    this.data = data;

    this.conditions = data.getSubsectionsOrNull("conditions");
    this.actions = data.getSubsections("actions").map((actionData: Config) => new ActionScript(actionData, logger, engine));
  }

  async run(context: Context, variables: Variable[]) {
    if (!await this.meetsConditions(context)) return;

    this.actions.forEach(action => action.run(context, variables));
  }

  async meetsConditions(context: Context) {
    if (!this.conditions) return true;

    for (const condition of this.conditions) {
      const isMet = await this.engine.condition!.isConditionMet(condition, this, context);

      if (!isMet) return false;
    }

    return true;
  }
}