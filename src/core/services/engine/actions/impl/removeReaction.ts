import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionScript } from 'core/services/engine/actionScript.js';
import Utils from '@utils';

export default class RemoveReactionAction extends Action {

  public parameters() {
    return ["message"];
  }

  async onTrigger(script: ActionScript, context: Context, variables: Variable[]) {
    const emoji = await Utils.applyVariables(script.args.getStringOrNull('emoji'), variables, context)

    emoji ? context.message!.reactions.cache.get(emoji)?.remove() : context.message!.reactions.removeAll();
  }
}