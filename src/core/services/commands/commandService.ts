import { join } from 'path';
import { sync } from 'glob';

import { Collection } from 'discord.js';
import { Manager, Command, Plugin } from '@itsmybot';

export default class CommandService {
  manager: Manager
  commandsDir: string
  commands: Collection<string, Command>

  constructor(manager: Manager) {
    this.manager = manager;
    this.commandsDir = manager.managerOptions.dir.commands;
    this.commands = manager.commands;
  }

  async initialize() {
    this.manager.logger.info("Command service initialized.");
    await this.registerFromDir(this.commandsDir);
  }

  getCommand(name: string) {
    return this.commands.get(name) || null;
  }

  getCommands() {
    return this.commands;
  }

  async registerFromDir(commandsDir: string, plugin: Plugin | null = null) {
    const commandFiles = sync(join(commandsDir, '**', '*.js'));

    for (const filePath of commandFiles) {
      const commandPath = new URL('file://' + filePath.replace(/\\/g, '/')).href;
      const { default: CommandInstance } = await import(commandPath);

      await this.registerCommand(new CommandInstance(this.manager, plugin));
    };
  }

  async registerCommand(command: Command) {
    try {
      if (!command.data) throw new Error("Command needs a data object.");
      if (this.commands.has(command.data.name)) throw new Error("Command already exists.");

      this.commands.set(command.data.name, command);

      if (command.data.aliases) {
        for (const alias of command.data.aliases) {
          const aliasCommandInstance = command
          aliasCommandInstance.data.setName(alias).setAliases([])
          if (this.commands.has(alias)) throw new Error(`Command alias '${alias}' already exists.`);

          this.commands.set(alias, aliasCommandInstance);
        };
      }
    } catch (error: any) {
      command.logger.error(`Error initializing command '${command.data.name}'`, error.stack);
    }
  }

  async deployCommands() {
    const enabledCommands = [...this.commands.values()]
      .filter(cmd => !cmd.data.enabled === false)
      .map(cmd => cmd.data);

    try {
      const primaryGuildCommands = enabledCommands.filter(cmd => cmd.public === false);
      const guild = await this.manager.client.guilds.fetch(this.manager.primaryGuildId);
      if (primaryGuildCommands && guild) await guild.commands.set(primaryGuildCommands);

      const publicCommands = enabledCommands.filter(cmd => cmd.public === true);
      if (publicCommands) await this.manager.client.application?.commands.set(publicCommands);
    } catch (error: any) {
      this.manager.logger.error(`Error syncing commands to Discord: ${error.message}`, error.stack);
    }
  }
}

