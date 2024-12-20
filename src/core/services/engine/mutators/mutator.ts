import { Plugin, Config } from '@itsmybot';
import { Base, Context, Variable } from '@contracts';

export abstract class Mutator<T extends Plugin | undefined = undefined> extends Base<T>{
  abstract id: string;

  abstract apply(args: Config, context: Context, variables: Variable[]): Promise<Context> | Context

  public missingArgument(missing: string) {
    this.logger.error(`Missing argument: ${missing}`);
  }
}