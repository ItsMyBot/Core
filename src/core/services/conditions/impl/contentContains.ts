import { Condition, ConditionData } from '@itsmybot';
import { Context, Variable } from '@contracts';

export default class ContentContainsCondition extends Condition {
  id = "contentContains";

  isMet(condition: ConditionData, context: Context, variables: Variable[]) {
    const arg = condition.args.getStringsOrNull("value")
    if (!arg) return condition.missingArg("value");
    if (!context.content) return condition.missingContext("content");

    return arg && arg.some(text => context.content!.includes(text));
  }
}