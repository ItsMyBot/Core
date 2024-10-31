import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionScript } from 'core/services/engine/actionScript.js';
import Utils from '@utils';

export default class AddReactionAction extends Action {
  async onTrigger(script: ActionScript, context: Context, variables: Variable[]) {

    if (!context.message) return this.missingContext("message", script, context);
    if (!script.args.getStringOrNull("emoji")) return this.missingArgument("emoji", script, context);

    const emoji = await Utils.applyVariables(script.args.getString("emoji"), variables, context)
    context.message.react(emoji);
  }
}