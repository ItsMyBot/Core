import EngineService from './engineService.js';
import { Logger } from '@utils';
import { Config, ActionData, ConditionData } from '@itsmybot';
import { Context, Variable } from '@contracts';

export class BaseScript {
  data: Config;
  conditions: ConditionData[];
  actions: ActionData[];
  logger: Logger;
  engine: EngineService;

  constructor(engine: EngineService, data: Config, logger: Logger, ) {
    this.logger = logger;
    this.engine = engine
    this.data = data;
    this.conditions = data.has("conditions") ? this.engine.condition.buildConditions(data.getSubsections("conditions")) : [];
    this.actions = data.has("actions") ? data.getSubsections("actions").map((actionData: Config) => new ActionData(engine, actionData, logger, )) : [];
  }

  async meetsConditions(context: Context, variables: Variable[]): Promise<boolean> {
    return this.engine.condition.meetsConditions(this.conditions, context, variables);
  }
}