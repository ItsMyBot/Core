import { Condition } from '../condition.js';
import { ActionScript, Config } from '@itsmybot';
import { Context } from '@contracts';

export class ContentCondition extends Condition {
  isMet(script: ActionScript, context: Context, args: Config) {
    const arg = args.getStringsOrNull("text")
    if (!arg) return this.missingArgument("text");
    if (!context.content) return this.missingContext("content");

    return arg && arg.some(text => context.content === text);
  }
}