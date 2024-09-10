import { Manager, Plugin, Config } from '@itsmybot';
import { Logger } from '@utils';
import { Context } from '@contracts';
import { BaseScript } from '../baseScript';

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

  abstract isMet(script: BaseScript, context: Context, args: Config): Promise<boolean> | boolean
}