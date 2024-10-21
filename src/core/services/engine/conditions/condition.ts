import { Plugin, Config } from '@itsmybot';
import { Base, Context } from '@contracts';
import { BaseScript } from '../baseScript';

export abstract class Condition<T extends Plugin | undefined = undefined> extends Base<T> {
  public parameters(): string[] {
    return [];
  }

  public arguments(): string[] {
    return [];
  }

  abstract isMet(script: BaseScript, context: Context, args: Config): Promise<boolean> | boolean
}