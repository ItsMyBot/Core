import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionData } from '@itsmybot';
import Utils from '@utils';

export default class SendMessageAction extends Action {
  id = "sendMessage";

  async onTrigger(script: ActionData, context: Context, variables: Variable[]) {
    const channelConfig = await Utils.applyVariables(script.args.getStringOrNull("channel"), variables, context)

    const channel = channelConfig ? await Utils.findTextChannel(channelConfig) : context.channel;
    if (!channel || !channel.isTextBased() || channel.isDMBased()) return script.missingArg("channel", context);

    const message = await channel.send(await Utils.setupMessage({ config: script.args, context, variables }));

    const newContext: Context = {
      ...context,
      message,
      content: message.content,
      channel: message.channel
    };

    this.triggerActions(script, newContext, variables);
  }
}