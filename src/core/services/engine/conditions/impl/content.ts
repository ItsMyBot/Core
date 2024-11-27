import { Condition, ConditionData } from '@itsmybot';
import { Context, Variable } from '@contracts';

export class ContentCondition extends Condition {
  isMet(condition: ConditionData, context: Context, variables: Variable[]) {
    const arg = condition.args.getStringsOrNull("text")
    if (!arg) return condition.missingArg("text");
    if (!context.content) return condition.missingContext("content");

    return arg && arg.some(text => context.content === text);
  }
}