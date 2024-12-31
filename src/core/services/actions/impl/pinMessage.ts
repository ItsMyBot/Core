import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionData } from '@itsmybot';

export default class PinMessageAction extends Action {
  id = "pinMessage";

  onTrigger(script: ActionData, context: Context, variables: Variable[]) {
    if (!context.message) return script.missingContext("message", context);

    context.message.pin();
  }
}