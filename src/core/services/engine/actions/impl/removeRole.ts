import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionData } from 'core/services/engine/actions/actionData.js';
import Utils from '@utils';
import { Role } from 'discord.js';

export default class RemoveRoleAction extends Action {
  async onTrigger(script: ActionData, context: Context, variables: Variable[]) {
    const rolesToRemove = script.args.getStringsOrNull("role")

    if (!context.member) return script.missingContext("member", context);
    if (!rolesToRemove) return script.missingArg("role", context);

    let roles = await Promise.all(rolesToRemove.map(async roleName => Utils.findRole(await Utils.applyVariables(roleName, variables, context), context.guild)));
    roles.filter(Boolean);

    if (roles.length) {
      context.member.roles.remove(roles as Role[]);
    }
  }
}