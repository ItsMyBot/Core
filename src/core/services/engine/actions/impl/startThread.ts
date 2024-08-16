import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionScript } from 'core/services/engine/actionScript.js';
import Utils from '@utils';

export default class StartThreadAction extends Action {

  public parameters() {
    return ["message"];
  }

  async onTrigger(script: ActionScript, context: Context, variables: Variable[]) {

    const args = {
      name: await Utils.applyVariables(script.args.getString("name"), variables, context) || "Thread",
      autoArchiveDuration: script.args.getNumberOrNull("duration") || 60
    }

    const thread = await context.message!.startThread(args);

    const newContext: Context = {
      ...context,
      message: await thread.fetchStarterMessage() || context.message,
      content: thread.name,
      channel: thread
    };

    this.triggerActions(script, newContext, variables);
  }
}