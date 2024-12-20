import { Condition, ConditionData } from '@itsmybot';
import { Context, Variable } from '@contracts';

export default class IsBotCondition extends Condition {
  id = "isBot";

  isMet(condition: ConditionData, context: Context, variables: Variable[]) {
    if (!context.member) return condition.missingContext("member");

    return context.member.user.bot;
  }
}