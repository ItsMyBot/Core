import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionScript } from 'core/services/engine/actionScript.js';
import Utils from '@utils';

export default class SendPrivateMessageAction extends Action {

  public parameters() {
    return ["member"];
  }

  async onTrigger(script: ActionScript, context: Context, variables: Variable[]) {
    context.member!.send(await Utils.setupMessage({ config: script.args, context, variables }));
  }
}