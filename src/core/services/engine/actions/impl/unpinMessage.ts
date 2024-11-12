import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionData } from 'core/services/engine/actions/actionData.js';

export default class UnpinMessageAction extends Action {
  onTrigger(script: ActionData, context: Context, variables: Variable[]) {
    if (!context.message) return script.missingContext("message", context);

    context.message.unpin();
  }
}