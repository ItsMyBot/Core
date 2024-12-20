import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionData } from 'core/services/engine/actions/actionData.js';
import Utils from '@utils';

export default class SendPrivateMessageAction extends Action {
  id = "sendPrivateMessage";

  public parameters() {
    return ["member"];
  }

  async onTrigger(script: ActionData, context: Context, variables: Variable[]) {
    if (!context.member) return script.missingContext("member", context);

    const message = await context.member.send(await Utils.setupMessage({ config: script.args, context, variables }));

    const newContext: Context = {
      ...context,
      message,
      content: message.content,
      channel: message.channel
    };

    this.triggerActions(script, newContext, variables);
  }
}