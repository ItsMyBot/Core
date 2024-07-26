import { Manager, Plugin, ActionScript } from '@itsmybot';
import { Logger } from '@utils';
import { Context } from '@contracts';

export abstract class Filter {
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

  abstract isMet(script: ActionScript, context: Context, args: any): Promise<boolean> | boolean
}