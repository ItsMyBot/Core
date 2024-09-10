import { Condition } from '../condition.js';
import { ActionScript, Config } from '@itsmybot';
import { Context } from '@contracts';

export class IsBotCondition extends Condition {

  isMet(script: ActionScript, context: Context, args: Config) {
    return context.member!.user.bot;
  }
}