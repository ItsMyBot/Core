import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionData } from 'core/services/engine/actions/actionData.js';
import Utils from '@utils';
import { Role } from 'discord.js';

export default class AddRoleAction extends Action {
  async onTrigger(script: ActionData, context: Context, variables: Variable[]) {
    const rolesToAdd = script.args.getStringsOrNull("role")

    if (!context.member) return script.missingContext("member", context);
    if (!context.guild) return script.missingContext("guild", context);
    if (!rolesToAdd) return script.missingArg("role", context);

    let roles = await Promise.all(
      rolesToAdd.map(async roleName =>
        Utils.findRole(await Utils.applyVariables(roleName, variables, context), context.guild)
      ));

    roles = roles.filter(Boolean);
    
    if (roles.length) {
      await context.member.roles.add(roles as Role[]);
    }
  }
}