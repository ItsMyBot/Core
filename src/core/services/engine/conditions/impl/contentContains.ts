import { Condition } from '../condition.js';
import { ActionScript, Config } from '@itsmybot';
import { Context } from '@contracts';

export class ContentContainsCondition extends Condition {

  public arguments() {
    return ["text"];
  }

  isMet(script: ActionScript, context: Context, args: Config) {
    const arg = args.getStrings("text")
    return arg && arg.some(text => context.content!.includes(text));
  }
}