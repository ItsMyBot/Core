import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionScript } from 'core/services/engine/actionScript.js';
import Utils from '@utils';

export default class SendMessageAction extends Action {

  async onTrigger(script: ActionScript, context: Context, variables: Variable[]) {
    const channelConfig = await Utils.applyVariables(script.args.getStringOrNull("channel"), variables, context)

    const channel: any = channelConfig ? await Utils.findTextChannel(channelConfig) : context.channel;
    if (!channel) return this.logger.warn(`No channel provided for sendMessage action`);


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