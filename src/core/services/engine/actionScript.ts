import { Logger } from '@utils';
import { Config, BaseScript } from '@itsmybot';
import EngineService from './engineService';
import { Context, Variable } from '@contracts';

export class ActionScript extends BaseScript {
  id?: string;
  args: Config;
  triggers?: string[];
  mutators?: Config[];
  triggerActions: ActionScript[];
  executionCounter: number = 0;
  lastExecutionTime: number = 0;

  constructor(engine: EngineService, data: Config, logger: Logger, ) {
    super(engine, data, logger);
    this.id = data.getStringOrNull("id");
    this.args = data.getSubsectionOrNull("args") || data.empty();
    this.triggers = data.getStringsOrNull("triggers");
    this.mutators = data.getSubsectionsOrNull("mutators");
    this.triggerActions = data.has("args.actions") ? data.getSubsections("args.actions").map((actionData: Config) => new ActionScript(engine, actionData, logger)) : [];
  }

  async run(context: Context, variables: Variable[] = []) {
    if (!await this.shouldExecute(context, variables)) return;

    const variablesCopy = [...variables];
    const updatedContext = await this.applyMutators(context, variables)

    if (this.args.has("delay")) {
      setTimeout(() => this.executeActions(updatedContext, variablesCopy), this.args.getNumber("delay") * 1000)
    } else {
      this.executeActions(updatedContext, variablesCopy);
    }
  }

  executeActions(context: Context, variables: Variable[]) {
    if (!this.actions.length) {
      this.engine.action.triggerAction(this, context, variables);
    } else {
      this.actions.forEach(subAction => subAction.run(context, variables));
    }

    this.lastExecutionTime = Date.now();
  }

  async applyMutators(context: Context, variables: Variable[]) {
    if (!this.mutators) return context

    for (const mutator of this.mutators) {
      context = await this.engine.mutator.applyMutator(mutator, context, variables)
    }

    return context
  }

  async shouldExecute(context: Context, variables: Variable[]) {
    const meetsConditions = await this.meetsConditions(context, variables);
    if (!meetsConditions) return false;

    this.executionCounter++;

    if (this.args.has("every") && this.executionCounter % this.args.getNumber("every") !== 0) return false;
    if (this.args.has("cooldown") && this.lastExecutionTime && (Date.now() - this.lastExecutionTime) < this.args.getNumber("cooldown") * 1000) return false;
    if (this.args.has("chance") && Math.floor(Math.random() * 100) + 1 > this.args.getNumber("chance")) return false;

    return true;
  }
}