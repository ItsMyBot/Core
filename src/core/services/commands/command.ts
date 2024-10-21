import { Manager, Plugin, User } from '@itsmybot';
import { AutocompleteInteraction, ContextMenuCommandInteraction } from 'discord.js';
import { CommandInteraction, Base } from "@contracts";

export abstract class Command<T extends Plugin | undefined = undefined>  extends Base<T> {
  public data: any;

  constructor(manager: Manager, plugin?: T) {
    super(manager, plugin);

    this.data = this.build();
  }

  public abstract build(): any;

  public async autocomplete(interaction: AutocompleteInteraction<'cached'>): Promise<void | any> {
    throw new Error('Method not implemented.');
  }

  public abstract execute(interaction: CommandInteraction | ContextMenuCommandInteraction<'cached'>, user: User): Promise<void | any>
}