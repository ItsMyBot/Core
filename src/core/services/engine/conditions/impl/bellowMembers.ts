import { Condition } from '../condition.js';
import { ActionScript, Config } from '@itsmybot';
import { Context } from '@contracts';

export class BellowMembersCondition extends Condition {
  isMet(script: ActionScript, context: Context, args: Config) {
    if (!context.guild) return this.missingContext("guild");
    const amount = args.getNumberOrNull("amount");
    if (!amount) return this.missingArgument("amount");

    return context.guild!.memberCount < amount;
  }
}