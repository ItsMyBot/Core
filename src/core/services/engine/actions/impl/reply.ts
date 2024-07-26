import { Context, Variable } from '@contracts';
import { Action } from '../action.js';
import { ActionScript } from 'core/services/engine/actionScript.js';
import Utils from '@utils';

export default class ReplyAction extends Action {

  async onTrigger(script: ActionScript, context: Context, variables: Variable[]) {
    if (context.interaction && context.interaction.isRepliable()) {
      if (context.interaction.replied) {
        return context.interaction.followUp(await Utils.setupMessage({ config: script.args, context, variables }));
      } else {
        return context.interaction.reply(await Utils.setupMessage({ config: script.args, context, variables }));
      }
    }

    if (context.message) {
      return context.message.reply(await Utils.setupMessage({ config: script.args, context, variables }));
    }
  }
}