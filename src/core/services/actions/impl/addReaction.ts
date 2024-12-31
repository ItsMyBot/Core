import { Context, Variable,  } from '@contracts';
import { Action } from '../action.js';
import { ActionData } from '@itsmybot';
import Utils from '@utils';

export default class AddReactionAction extends Action {
  id = "addReaction";

  async onTrigger(script: ActionData, context: Context, variables: Variable[]) {

    if (!context.message) return script.missingContext("message", context);
    if (!script.args.getStringOrNull("emoji")) return script.missingArg("emoji", context);

    const emoji = await Utils.applyVariables(script.args.getString("emoji"), variables, context)
    context.message.react(emoji);
  }
}