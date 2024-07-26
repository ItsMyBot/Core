import { Context } from '@contracts';
import { Plugin, Manager } from '@itsmybot';
import { Logger } from '@utils';

export abstract class Expansion {
  manager: Manager;
  plugin?: Plugin;
  logger: Logger;


  constructor(manager: Manager, plugin: Plugin | undefined = undefined) {
    this.manager = manager;
    this.plugin = plugin;
    this.logger = plugin ? plugin.logger : manager.logger;
  }

  abstract onRequest(context: Context, placeholderName: string): Promise<string | undefined>
}
