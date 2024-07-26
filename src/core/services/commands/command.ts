import { Manager, Plugin, User } from '@itsmybot';
import { Logger } from '@utils';
import { AutocompleteInteraction, MessageContextMenuCommandInteraction } from 'discord.js';
import { CommandInteraction } from "@contracts";

export abstract class Command {
  public manager: Manager;
  public plugin?: Plugin;
  public logger: Logger
  public data: any

  constructor(manager: Manager, plugin: Plugin | undefined = undefined) {
    this.manager = manager;
    this.plugin = plugin;
    this.logger = plugin ? plugin.logger : manager.logger;
  }

  public async autocomplete(interaction: AutocompleteInteraction<'cached'>): Promise<void | any> {
    throw new Error('Method not implemented.');
  }

  public abstract execute(interaction: CommandInteraction | MessageContextMenuCommandInteraction<'cached'>, user: User): Promise<void | any>
}