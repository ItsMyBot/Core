import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionScript } from 'core/services/engine/actionScript.js';
import Utils from '@utils';

export default class RemoveReactionAction extends Action {
  async onTrigger(script: ActionScript, context: Context, variables: Variable[]) {
    if (!context.message) return this.missingContext("message", script, context);

    const emoji = await Utils.applyVariables(script.args.getStringOrNull('emoji'), variables, context)

    emoji ? context.message.reactions.cache.get(emoji)?.remove() : context.message.reactions.removeAll();
  }
}