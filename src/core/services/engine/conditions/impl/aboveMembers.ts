import { ConditionData } from '@itsmybot';
import { Condition } from '../condition.js';
import { Context, Variable } from '@contracts';

export class AboveMembersCondition extends Condition {
  isMet(condition: ConditionData, context: Context, variables: Variable[]) {
    if (!context.guild) return condition.missingContext("guild");
    const amount = condition.args.getNumberOrNull("amount");
    if (!amount) return condition.missingArg("amount");

    return context.guild.memberCount > amount;
  }
}