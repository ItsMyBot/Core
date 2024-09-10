import { Manager, Plugin, User } from '@itsmybot';
import { Logger } from '@utils';
import { ButtonInteraction, ModalSubmitInteraction, AnySelectMenuInteraction } from 'discord.js';
import { ComponentBuilder } from '@builders';

export abstract class Component {
  public manager: Manager;
  public plugin?: Plugin;
  public logger: Logger

  public abstract name: string;
  public abstract data: ComponentBuilder;

  constructor(manager: Manager, plugin: Plugin | undefined = undefined) {
    this.manager = manager;
    this.plugin = plugin;
    this.logger = plugin ? plugin.logger : manager.logger;
  }

  public abstract execute(interaction: AnySelectMenuInteraction<'cached'> | ButtonInteraction<'cached'> | ModalSubmitInteraction<'cached'>, user: User): Promise<void | any>
}