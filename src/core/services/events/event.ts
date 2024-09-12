
import { Base } from '@contracts';
import { Plugin } from '@itsmybot';

export abstract class Event<T extends Plugin | undefined = undefined> extends Base<T>{
  abstract name: string
  once: boolean = false;
  priority: number = 3;

  public abstract execute(...args: any): any | void;

  /**
    * Stop the function and it will not execute events with a lower priority.
    * @throws stop
    */
  cancelEvent() {
    throw 'stop';
  }
}