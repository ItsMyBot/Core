import { Logger } from '@utils';
import { Config, BaseScript, Manager } from '@itsmybot';
import { Context, Variable } from '@contracts';
import Utils from '@utils';
import manager from '@itsmybot';

export class ActionData extends BaseScript {
  public id?: string;
  public args: Config;
  private fileName: string;
  private path: string;
  public triggers?: string[];
  public mutators?: Config;
  public triggerActions: ActionData[];
  public executionCounter: number = 0;
  public lastExecutionTime: number = 0;

  constructor(manager: Manager, data: Config, logger: Logger, ) {
    super(manager, data, logger);
    this.id = data.getStringOrNull("id");
    this.args = data.getSubsectionOrNull("args") || data.empty();
    this.triggers = data.getStringsOrNull("triggers");
    this.mutators = data.getSubsectionOrNull("mutators");
    this.triggerActions = data.has("args.actions") ? data.getSubsections("args.actions").map((actionData: Config) => new ActionData(manager, actionData, logger)) : [];
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
      this.manager.services.action.triggerAction(this, context, variables);
    } else {
      this.actions.forEach(subAction => subAction.run(context, variables));
    }

    this.lastExecutionTime = Date.now();
  }

  async applyMutators(context: Context, variables: Variable[]) {
    if (!this.mutators) return context

    for (const [mutator, value] of this.mutators.values) {
      const parsedValue = await Utils.applyVariables(value, variables, context)

      switch (mutator) {
        case "content":
          context.content = parsedValue
          break; 

        case "member":
          const newMember = await context.member?.guild.members.fetch(parsedValue)
          if (!newMember) continue

          const newUserMember = await this.manager.services.user.findOrCreate(newMember)
          context.user = newUserMember
          context.member = newMember
          break;

        case 'user':
          const newUser = await this.manager.services.user.findOrNull(parsedValue)
          if (!newUser) continue

          context.user = newUser
          break;
        
        case 'channel':
          const newChannel = await Utils.findChannel(parsedValue, context.guild)
          if (!newChannel) continue

          context.channel = newChannel
          break;
        
        case 'guild':
          const newGuild = await this.manager.client.guilds.fetch(parsedValue)
          if (!newGuild) continue

          context.guild = newGuild
          break;
        
        case 'role':
          const newRole = await Utils.findRole(parsedValue, context.guild)
          if (!newRole) continue

          context.role = newRole
          break;
      }
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

  public logError(message: string) {
    this.logger.error(`${message} in ${this.fileName} at ${this.path}`);
  }

  public async missingArg(missing: string, context: Context) {
    this.logError(`Missing required argument: "${missing}"`);

    const message = await Utils.setupMessage({
      config: manager.configs.lang.getSubsection("engine.missing-context"),
      context,
      variables: [
        { searchFor: "%missing%", replaceWith: missing },
        { searchFor: "%script%", replaceWith: this.id }
      ]
    });

    if (context.interaction) {
      context.interaction.reply(message);
    } else if (context.message) {
      context.message.reply(message);
    }
  }

  public async missingContext(missing: string, context: Context) {
    this.logError(`Missing context: "${missing}"`);

    const message = await Utils.setupMessage({
      config: manager.configs.lang.getSubsection("engine.missing-argument"),
      context,
      variables: [
        { searchFor: "%missing%", replaceWith: missing },
        { searchFor: "%script%", replaceWith: this.id }
      ]
    });

    if (context.interaction) {
      context.interaction.reply(message);
    } else if (context.message) {
      context.message.reply(message);
    }
  }
}