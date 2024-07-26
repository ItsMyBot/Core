import { Condition } from '../condition.js';
import { ActionScript, Config } from '@itsmybot';
import { Context } from '@contracts';

export class AboveMembersCondition extends Condition {

  public parameters() {
    return ["guild"];
  }

  public arguments() {
    return ["amount"];
  }

  isMet(script: ActionScript, context: Context, args: Config) {
    return context.guild!.memberCount > args.getNumber("amount");
  }
}