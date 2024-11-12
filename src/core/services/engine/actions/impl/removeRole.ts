import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionScript } from 'core/services/engine/actionScript.js';
import Utils from '@utils';
import { Role } from 'discord.js';

export default class RemoveRoleAction extends Action {
  async onTrigger(script: ActionScript, context: Context, variables: Variable[]) {
    const rolesToRemove = script.args.getStringsOrNull("role")

    if (!context.member) return this.missingContext("member", script, context);
    if (!rolesToRemove) return this.missingArgument("role", script, context);

    let roles = await Promise.all(rolesToRemove.map(async roleName => Utils.findRole(await Utils.applyVariables(roleName, variables, context), context.guild)));
    roles.filter(Boolean);

    if (roles.length) {
      context.member.roles.remove(roles as Role[]);
    }
  }
}