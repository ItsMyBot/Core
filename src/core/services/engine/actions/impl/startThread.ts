import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionData } from 'core/services/engine/actions/actionData.js';
import Utils from '@utils';

export default class StartThreadAction extends Action {
  async onTrigger(script: ActionData, context: Context, variables: Variable[]) {
    if (!context.message) return script.missingContext("message", context);

    const args = {
      name: await Utils.applyVariables(script.args.getString("name"), variables, context) || "Thread",
      autoArchiveDuration: script.args.getNumberOrNull("duration") || 60
    } 

    if (context.message.channel.isThread() || context.message.channel.isDMBased()) return script.missingContext("channel", context);

    const thread = await context.message.startThread(args);
    const newContext: Context = {
      ...context,
      message: await thread.fetchStarterMessage() || context.message,
      content: thread.name,
      channel: thread
    };

    this.triggerActions(script, newContext, variables);
  }
}