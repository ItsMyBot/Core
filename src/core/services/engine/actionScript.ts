import { Logger } from '@utils';
import { Config } from '@itsmybot';
import EngineService from './engineService';
import { Context, Variable } from '@contracts';

export class ActionScript {
  logger: Logger;
  engine: EngineService;

  id?: string;
  args: Config;
  filters?: Config;
  triggers?: string[];
  conditions?: Config[];
  mutators?: Config[];
  subActions: ActionScript[];
  triggerActions: ActionScript[];
  executionCounter: number = 0;
  lastExecutionTime: number = 0;

  constructor(data: Config, logger: Logger, engine: EngineService) {
    this.logger = logger;
    this.engine = engine;

    this.id = data.getStringOrNull("id");
    this.args = data.getSubsectionOrNull("args") || data.empty();
    this.filters = data.getSubsectionOrNull("filters");
    this.triggers = data.getStringsOrNull("triggers");
    this.conditions = data.getSubsectionsOrNull("conditions");
    this.mutators = data.getSubsectionsOrNull("mutators");
    this.subActions = data.has("actions") ? data.getSubsections("actions").map((actionData: Config) => new ActionScript(actionData, logger, engine)) : [];
    this.triggerActions = data.has("args.actions") ? data.getSubsections("args.actions").map((actionData: Config) => new ActionScript(actionData, logger, engine)) : [];
  }

  async handleTrigger(trigger: string, context: Context, variable: Variable[] = []) {
    if (!this.hasTrigger(trigger)) return;

    this.run(context, variable)
  }

  async run(context: Context, variables: Variable[] = []) {

    if (!await this.shouldExecute(context)) return;

    const variablesCopy = [...variables];
    const updatedContext = await this.applyMutators(context, variables)

    if (this.args.has("delay")) {
      setTimeout(() => this.executeActions(updatedContext, variablesCopy), this.args.getNumber("delay") * 1000)
    } else {
      this.executeActions(updatedContext, variablesCopy);
    }
  }

  executeActions(context: Context, variables: Variable[]) {
    if (!this.subActions.length) {
      this.engine.action.triggerAction(this, context, variables);
    }
    else {
      this.subActions.forEach(subAction => subAction.run(context, variables));
    }

    this.lastExecutionTime = Date.now();
  }

  hasTrigger(trigger: string) {
    return !this.triggers || this.triggers.includes(trigger);
  }

  async applyMutators(context: Context, variables: Variable[]) {
    if (!this.mutators) return context

    for (const mutator of this.mutators) {
      context = await this.engine.mutator.applyMutator(mutator, context, variables)
    }

    return context
  }

  async shouldExecute(context: Context) {
    const passesFilters = await this.passesFilters(context);
    if (!passesFilters) return false;

    const meetsConditions = await this.meetsConditions(context);
    if (!meetsConditions) return false;

    this.executionCounter++;

    if (this.args.has("every") && this.executionCounter % this.args.getNumber("every") !== 0) return false;
    if (this.args.has("cooldown") && this.lastExecutionTime && (Date.now() - this.lastExecutionTime) < this.args.getNumber("cooldown") * 1000) return false;
    if (this.args.has("chance") && Math.floor(Math.random() * 100) + 1 > this.args.getNumber("chance")) return false;

    return true;
  }

  async passesFilters(context: Context) {
    if (!this.filters) return true;

    for (const [filterName, filterValue] of this.filters.values) {
      const isMet = await this.engine.filter.isFilterMet(filterName, this, context, filterValue);

      if (!isMet) return false;
    }

    return true;
  }

  async meetsConditions(context: Context) {
    if (!this.conditions) return true;

    for (const condition of this.conditions) {
      const isMet = await this.engine.condition.isConditionMet(condition, this, context);

      if (!isMet) return false;
    }

    return true;
  }
}