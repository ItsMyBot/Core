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

    context.message!.startThread(args);
  }
}