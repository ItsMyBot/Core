import { Plugin, ActionScript } from '@itsmybot';
import { Base, Context, Variable } from '@contracts';
import Utils from '@utils';

export abstract class Action<T extends Plugin | undefined = undefined> extends Base<T>{
  public trigger(script: ActionScript, context: Context, variables: Variable[]) {
    const variablesCopy = [...variables];
    this.onTrigger(script, context, variablesCopy);
  }

  public abstract onTrigger(script: ActionScript, context: Context, variables: Variable[]): any | void;

  public triggerActions(script: ActionScript, context: Context, variables: Variable[]) {
    script.triggerActions.forEach(subAction => subAction.run(context, variables));
  }

  public async missingContext(missing: string, script: ActionScript, context: Context) {
    script.logger.error(`The script ${script.id} is missing the context: ${missing}`);

    const message = await Utils.setupMessage({
      config: this.manager.configs.lang.getSubsection("engine.missing-context"),
      context,
      variables: [
        { searchFor: "missing", replaceWith: missing },
        { searchFor: "script", replaceWith: script.id }
      ]
    });

    if (context.interaction) {
      context.interaction.reply(message);
    } else if (context.message) {
      context.message.reply(message);
    }
  }
  
  public async missingArgument(missing: string, script: ActionScript, context: Context) {
    this.logger.error(`The script argument: ${missing}`);

    const message = await Utils.setupMessage({
      config: this.manager.configs.lang.getSubsection("engine.missing-argument"),
      context,
      variables: [
        { searchFor: "%missing%", replaceWith: missing },
        { searchFor: "%script%", replaceWith: script.id }
      ]
    });

    if (context.interaction) {
      context.interaction.reply(message);
    } else if (context.message) {
      context.message.reply(message);
    }
  }
}