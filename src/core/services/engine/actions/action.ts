import { Plugin, ActionScript } from '@itsmybot';
import { Base, Context, Variable } from '@contracts';

export abstract class Action<T extends Plugin | undefined = undefined> extends Base<T>{
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