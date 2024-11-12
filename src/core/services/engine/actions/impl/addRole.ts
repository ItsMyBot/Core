import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionScript } from 'core/services/engine/actionScript.js';
import Utils from '@utils';
import { Role } from 'discord.js';

export default class AddRoleAction extends Action {
  async onTrigger(script: ActionScript, context: Context, variables: Variable[]) {
    const rolesToAdd = script.args.getStringsOrNull("role")

    if (!context.member) return this.missingContext("member", script, context);
    if (!context.guild) return this.missingContext("guild", script, context);
    if (!rolesToAdd) return this.missingArgument("role", script, context);

    let roles = await Promise.all(rolesToAdd.map(async roleName => Utils.findRole(await Utils.applyVariables(roleName, variables, context), context.guild)));
    roles = roles.filter(Boolean);
    
    if (roles.length) {
      await context.member.roles.add(roles as Role[]);
    }
  }
}