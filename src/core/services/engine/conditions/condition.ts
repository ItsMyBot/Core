import { Plugin, Config } from '@itsmybot';
import { Base, Context } from '@contracts';
import { BaseScript } from '../baseScript';

export abstract class Condition<T extends Plugin | undefined = undefined> extends Base<T> {
  abstract isMet(script: BaseScript, context: Context, args: Config): Promise<boolean> | boolean

  public missingContext(missing: string) {
    this.logger.error(`Missing context: ${missing}`);
    return false;
  }

  public missingArgument(missing: string) {
    this.logger.error(`Missing argument: ${missing}`);
    return false;
  }
}