import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionScript } from 'core/services/engine/actionScript.js';
import Utils from '@utils';
import { Role } from 'discord.js';

export default class RemoveRoleAction extends Action {

  public parameters() {
    return ["member"];
  }

  public arguments() {
    return ["role"];
  }

  async onTrigger(script: ActionScript, context: Context, variables: Variable[]) {
    const rolesToRemove: string[] = script.args.getStrings("role") ? script.args.getStrings("role") : [script.args.getString("role")];
    let roles = await Promise.all(rolesToRemove.map(async roleName => Utils.findRole(await Utils.applyVariables(roleName, variables, context), context.guild)));
    roles.filter(Boolean);

    if (roles.length) {
      context.member!.roles.add(roles as Role[]);
    }
  }
}