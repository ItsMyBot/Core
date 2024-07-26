import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionScript } from 'core/services/engine/actionScript.js';
import Utils from '@utils';

export default class AddReactionAction extends Action {

  public parameters() {
    return ["message"];
  }

  public arguments() {
    return ["emoji"];
  }

  async onTrigger(script: ActionScript, context: Context, variables: Variable[]) {
    const emoji = await Utils.applyVariables(script.args.getString("emoji"), variables, context)
    context.message!.react(emoji);
  }
}