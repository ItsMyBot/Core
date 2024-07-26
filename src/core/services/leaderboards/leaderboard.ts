import { Plugin, Manager } from '@itsmybot';
import { Logger } from '@utils';

export abstract class Leaderboard {
  manager: Manager;
  plugin?: Plugin;
  logger: Logger;

  abstract name: string;
  abstract description: string;

  constructor(manager: Manager, plugin: Plugin | undefined = undefined) {
    this.manager = manager;
    this.plugin = plugin;
    this.logger = plugin ? plugin.logger : manager.logger;
  }

  abstract getData(): Promise<string[]>;
}
