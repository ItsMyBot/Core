import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionData } from '@itsmybot';

export default class DeleteMessageAction extends Action {
  id = "deleteMessage";

  onTrigger(script: ActionData, context: Context, variables: Variable[]) {
    if (!context.message) return script.missingContext("message", context);

    context.message.delete();
  }
}