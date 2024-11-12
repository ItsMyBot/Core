import { Condition, ConditionData } from '@itsmybot';
import { Context, Variable } from '@contracts';
import Utils from '@utils';

export class HasRoleCondition extends Condition {
  isMet(condition: ConditionData, context: Context, variables: Variable[]) {
    if (!context.member) return condition.missingContext("member");
    const role = condition.args.getStringOrNull("role");
    if (!role) return condition.missingArg("role");

    return Utils.hasRole(context.member, role, condition.args.getBoolOrNull("inherit"));
  }
}