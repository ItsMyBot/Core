import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionData } from 'core/services/engine/actions/actionData.js';
import Utils from '@utils';

export default class RemoveReactionAction extends Action {
  async onTrigger(script: ActionData, context: Context, variables: Variable[]) {
    if (!context.message) return script.missingContext("message", context);

    const emoji = await Utils.applyVariables(script.args.getStringOrNull('emoji'), variables, context)

    return emoji
      ? context.message.reactions.cache.get(emoji)?.remove()
      : context.message.reactions.removeAll();
  }
}