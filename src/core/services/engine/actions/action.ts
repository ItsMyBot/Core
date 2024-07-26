import { Manager, Plugin, ActionScript } from '@itsmybot';
import { Logger } from '@utils';
import { Context, Variable } from '@contracts';

export abstract class Action {
  public manager: Manager;
  public plugin?: Plugin;
  public logger: Logger

  constructor(manager: Manager, plugin: Plugin | undefined = undefined) {
    this.manager = manager;
    this.plugin = plugin;
    this.logger = plugin ? plugin.logger : manager.logger;
  }

  public parameters(): string[] {
    return [];
  }

  public arguments(): string[] {
    return [];
  }

  public trigger(script: ActionScript, context: Context, variables: Variable[]) {
    const variablesCopy = [...variables];
    this.onTrigger(script, context, variablesCopy);
  }

  public abstract onTrigger(script: ActionScript, context: Context, variables: Variable[]): any | void;

  public triggerActions(script: ActionScript, context: Context, variables: Variable[]) {
    script.triggerActions.forEach(subAction => subAction.run(context, variables));
  }
}