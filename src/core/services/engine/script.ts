import EngineService from './engineService.js';
import { Logger } from '@utils';
import { Config, ActionScript } from '@itsmybot';
import { Context } from '@contracts';

export class Script {
  conditions?: Config[];
  actions: ActionScript[];
  logger: Logger;
  engine: EngineService;

  constructor(data: Config, logger: Logger, engine: EngineService) {
    this.logger = logger;
    this.engine = engine

    this.conditions = data.getSubsectionsOrNull("conditions");
    this.actions = data.getSubsections("actions").map((actionData: Config) => new ActionScript(actionData, logger, engine));
  }

  handleTrigger(trigger: string, context: Context) {
    if (!this.hasTrigger(trigger)) return;

    this.run(trigger, context)
  }

  async run(trigger: string, context: Context) {
    if (!await this.meetsConditions(context)) return;

    this.actions.forEach(action => action.handleTrigger(trigger, context));
  }

  hasTrigger(trigger: string) {
    for (const action of this.actions) {
      if (action.hasTrigger(trigger)) return true;
    }
    return false;
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