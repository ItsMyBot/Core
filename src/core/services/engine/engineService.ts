import { Collection, Role, ApplicationCommandOptionType, ChannelType } from 'discord.js';
import Utils from '@utils';

import { ActionHandler } from './actions/actionHandler.js';
import { FilterHandler } from './filters/filterHandler.js';
import { ConditionHandler } from './conditions/conditionHandler.js';

import { Manager, Script, CustomCommand, Command, User } from '@itsmybot';
import { Logger } from '@utils';
import { Context, BaseConfigSection, BaseConfig, Config, Variable, CommandInteraction } from '@contracts';

import ScriptConfig from '../../resources/engine/script.js';
import CustomCommandConfig from '../../resources/engine/customCommand.js';
import { CommandBuilder } from '@builders';
import { MutatorHandler } from './mutators/mutatorHandler.js';

export default class EngineService {
  manager: Manager

  scriptDir: string
  scripts: Collection<string, Script> = new Collection();

  customCommandDir: string
  customCommands: Collection<string, CustomCommand> = new Collection();

  action: ActionHandler
  filter: FilterHandler
  condition: ConditionHandler
  mutator: MutatorHandler

  constructor(manager: Manager) {
    this.manager = manager;
    this.scriptDir = manager.managerOptions.dir.scripts;
    this.customCommandDir = manager.managerOptions.dir.customCommands;
  }

  async initialize() {
    this.manager.logger.info('Script engine initialized.');
    this.action = await Utils.serviceFactory.createService(ActionHandler, this.manager);
    this.filter = await Utils.serviceFactory.createService(FilterHandler, this.manager);
    this.condition = await Utils.serviceFactory.createService(ConditionHandler, this.manager);
    this.mutator = await Utils.serviceFactory.createService(MutatorHandler, this.manager)

    const scripts = await new BaseConfigSection(ScriptConfig, this.manager.logger, 'scripts', 'build/core/resources/engine/scripts').initialize();
    for (const filePath of scripts) {
      this.registerScript(filePath[0], filePath[1], this.manager.logger);
    }
  }

  async loadCustomCommands() {
    const customCommands = await new BaseConfigSection(CustomCommandConfig, this.manager.logger, 'custom-commands', 'build/core/resources/engine/custom-commands').initialize();

    for (const filePath of customCommands) {
      this.registerCustomCommand(filePath[0], filePath[1]);
    }
  }

  handleEvent(event: string, context: Context) {
    for (const script of this.scripts.values()) {
      script.handleTrigger(event, context);
    }
  }

  async handleCustomCommand(id: string, interaction: CommandInteraction, user: User) {
    const customCommand = this.customCommands.get(id);
    if (!customCommand) return this.manager.logger.error(`Custom command ${id} not found`);

    const context = {
      interaction,
      user,
      guild: interaction.guild || undefined,
      channel: interaction.channel || undefined,
      member: interaction.member || undefined
    }

    const variables: Variable[] = []

    for (const option of interaction.options.data) {
      switch (true) {
        case option.member != null || option.member != undefined:
          const targetUserM = await this.manager.services.user.findOrCreate(option.member)
          if (!targetUserM) break;
          variables.push(...Utils.userVariables(targetUserM, `option_${option.name}`))
          break;

        case option.user != undefined:
          const targetUser = await this.manager.services.user.findOrNull(option.user.id)
          if (!targetUser) break;
          variables.push(...Utils.userVariables(targetUser, `option_${option.name}`))
          break;

        case option.role != null || option.role != undefined:
          variables.push(...Utils.roleVariables(option.role as Role, `option_${option.name}`))
          break;

        case option.channel != null || option.role != undefined:
          variables.push(...Utils.channelVariables(option.channel, `option_${option.name}`))
          break;

        case option.value != null || option.value != undefined:
          variables.push({
            searchFor: `%option_${option.name}%`,
            replaceWith: option.value,
          })
          break;

      }
    }
    customCommand.run(context, variables);
  }

  registerScript(id: string, script: BaseConfig, logger: Logger) {
    if (this.scripts.has(id)) return logger.warn(`Script ${id} is already registered`);

    const scriptClass = new Script(script, logger, this);
    this.scripts.set(id, scriptClass);
  }

  registerCustomCommand(id: string, customCommand: BaseConfig) {
    const customCommandClass = new CustomCommand(customCommand, this.manager.logger, this);

    class CustomCommandBase extends Command {
      data: CommandBuilder;
      options: Config[]

      constructor(manager: Manager) {
        super(manager);

        this.options = customCommand.getSubsectionsOrNull("options") || []
        this.data = new CommandBuilder()
          .setName(customCommandClass.data.getString("name"))
          .setConfig(customCommandClass.data)

        for (const optionConfig of this.options) {
          const option: CommandApplicationOption = {
            name: optionConfig.getString("name"),
            description: optionConfig.getString("description"),
            required: optionConfig.getBoolOrNull("required") || false,
            type: Utils.commandOptionType(optionConfig.getString("type"))!,
            max_length: undefined,
            min_length: undefined,
            max_value: undefined,
            min_value: undefined,
            channel_types: undefined,
            choices: undefined,
            toJSON() {
              return this
            }
          }

          if (option.type === ApplicationCommandOptionType.Channel) {
            if (optionConfig.has("channel-type")) {
              const channelType = Utils.channelType(optionConfig.getString("channel-type"))
              if (channelType) option.channel_types = [channelType]
            }
          }

          if (option.type === ApplicationCommandOptionType.String || option.type === ApplicationCommandOptionType.Number || option.type === ApplicationCommandOptionType.Integer) {
            if (optionConfig.has("choices")) {
              const choices: Config[] = optionConfig.getSubsections("choices")
              option.choices = []
              for (const choice of choices) {
                option.choices.push({ name: choice.getString("name"), value: choice.getString("value") })
              }
            }

            if (option.type === ApplicationCommandOptionType.String) {
              if (optionConfig.has("max-length")) option.max_length = optionConfig.getNumber("max-length")
              if (optionConfig.has("min-length")) option.min_length = optionConfig.getNumber("min-length")
            } else {
              if (optionConfig.has("max-value")) option.max_value = optionConfig.getNumber("max-value")
              if (optionConfig.has("min-value")) option.min_value = optionConfig.getNumber("min-value")
            }
          }

          this.data.options.push(option)
        }
      }

      async execute(interaction: CommandInteraction, user: User) {
        this.manager.services.engine.handleCustomCommand(id, interaction, user);
      }
    }

    this.manager.services.command.registerCommand(new CustomCommandBase(this.manager));
    this.customCommands.set(id, customCommandClass);
  }
}

interface CommandApplicationOption {
  name: string
  description: string
  required: boolean
  type: ApplicationCommandOptionType
  max_length: undefined | number
  min_length: undefined | number
  max_value: undefined | number
  min_value: undefined | number
  channel_types: undefined | ChannelType[]
  choices: undefined | { name: string, value: string | number }[]
  toJSON(): any
}