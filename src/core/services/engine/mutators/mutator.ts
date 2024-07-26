import { Manager, Plugin, Config } from '@itsmybot';
import { Logger } from '@utils';
import { Context, Variable } from '@contracts';

export abstract class Mutator {
  public manager: Manager;
  public plugin?: Plugin;
  public logger: Logger

  constructor(manager: Manager, plugin: Plugin | undefined = undefined) {
    this.manager = manager;
    this.plugin = plugin;
    this.logger = plugin ? plugin.logger : manager.logger;
  }

  public arguments(): string[] {
    return [];
  }

  abstract apply(args: Config, context: Context, variables: Variable[]): Promise<Context> | Context
}