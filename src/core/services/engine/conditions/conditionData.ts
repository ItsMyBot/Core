import { Logger } from '@utils';
import { Config, ActionData } from '@itsmybot';
import EngineService from '../engineService';

export class ConditionData {
  public id: string;
  private fileName: string;
  private path: string;
  public logger: Logger;
  public args: Config;
  public notMetActions: ActionData[];
  public engine: EngineService;

  constructor(engine: EngineService, condition: Config, notMetAction: boolean = true) {
    this.id = condition.getString("id");
    this.fileName = condition.fileName;
    this.path = condition.currentPath;
    this.engine = engine;
    this.logger = new Logger(`Condition/${this.id}`);
    this.args = condition.getSubsection("args");
    this.notMetActions = notMetAction && condition.has("args.not-met-actions") ? condition.getSubsections("args.not-met-actions").map((actionData: Config) => new ActionData(this.engine, actionData, condition.logger)) : [];
  }

  public logError(message: string) {
    this.logger.error(`${message} in ${this.fileName} at ${this.path}`);
    return false;
  }

  public missingArg(missing: string) {
    this.logError(`Missing required argument: "${missing}"`);
    return false;
  }

  public missingContext(missing: string) {
    this.logError(`Missing context: "${missing}"`);
    return false;
  }
}