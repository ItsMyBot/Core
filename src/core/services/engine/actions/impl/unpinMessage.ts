import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionScript } from 'core/services/engine/actionScript.js';

export default class UnpinMessageAction extends Action {

  public parameters() {
    return ["message"];
  }

  onTrigger(script: ActionScript, context: Context, variables: Variable[]) {
    context.message!.unpin();
  }
}