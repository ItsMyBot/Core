import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionScript } from 'core/services/engine/actionScript.js';

export default class DeleteMessageAction extends Action {
  onTrigger(script: ActionScript, context: Context, variables: Variable[]) {
    if (!context.message) return this.missingContext("message", script, context);

    context.message.delete();
  }
}