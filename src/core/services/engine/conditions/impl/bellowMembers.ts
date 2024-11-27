import { Condition, ConditionData } from '@itsmybot';
import { Context, Variable } from '@contracts';

export class BellowMembersCondition extends Condition {
  isMet(condition: ConditionData, context: Context, variables: Variable[]) {
    if (!context.guild) return condition.missingContext("guild");
    const amount = condition.args.getNumberOrNull("amount");
    if (!amount) return condition.missingArg("amount");

    return context.guild!.memberCount < amount;
  }
}