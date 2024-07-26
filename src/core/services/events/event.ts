
import { Manager, Plugin } from '@itsmybot';
import { Logger } from '@utils';

export abstract class Event {
  manager: Manager;
  plugin?: Plugin;
  logger: Logger;

  abstract name: string
  once: boolean = false;
  priority: number = 3;

  constructor(manager: Manager, plugin: Plugin | undefined = undefined) {
    this.manager = manager;
    this.plugin = plugin;
    this.logger = plugin ? plugin.logger : manager.logger;
  }

  public abstract execute(...args: any): any | void;

  /**
    * Stop the function and it will not execute events with a lower priority.
    * @throws stop
    */
  cancelEvent() {
    throw 'stop';
  }
}