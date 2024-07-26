import { Manager, Plugin, ActionScript, Config, Script, CustomCommand } from '@itsmybot';
import { Logger } from '@utils';
import { Context } from '@contracts';

export abstract class Condition {
  public manager: Manager;
  public plugin?: Plugin;
  public logger: Logger

  constructor(manager: Manager, plugin: Plugin | undefined = undefined) {
    this.manager = manager;
    this.plugin = plugin;
    this.logger = plugin ? plugin.logger : manager.logger;
  }

  public parameters(): string[] {
    return [];
  }

  public arguments(): string[] {
    return [];
  }

  abstract isMet(script: ActionScript | Script | CustomCommand, context: Context, args: Config): Promise<boolean> | boolean
}