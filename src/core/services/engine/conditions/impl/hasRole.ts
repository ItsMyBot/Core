import { Condition } from '../condition.js';
import { ActionScript, Config } from '@itsmybot';
import { Context } from '@contracts';
import Utils from '@utils';

export class HasRoleCondition extends Condition {

  public parameters() {
    return ["member"];
  }

  public arguments() {
    return ["role", "inherit" ];
  }

  isMet(script: ActionScript, context: Context, args: Config) {
    return Utils.hasRole(context.member!, args.getString("role"), args.getBoolOrNull("inherit"));
  }
}