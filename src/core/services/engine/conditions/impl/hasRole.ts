import { Condition } from '../condition.js';
import { ActionScript, Config } from '@itsmybot';
import { Context } from '@contracts';
import Utils from '@utils';

export class HasRoleCondition extends Condition {
  isMet(script: ActionScript, context: Context, args: Config) {
    if (!context.member) return this.missingContext("member");
    const role = args.getStringOrNull("role");
    if (!role) return this.missingArgument("role");

    return Utils.hasRole(context.member, role, args.getBoolOrNull("inherit"));
  }
}