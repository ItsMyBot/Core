import { Manager, Plugin, User } from '@itsmybot';
import { ButtonInteraction, ModalSubmitInteraction, AnySelectMenuInteraction } from 'discord.js';
import { ComponentBuilder } from '@builders';
import { Base } from '@contracts';

export abstract class Component<T extends Plugin | undefined = undefined> extends Base<T> {
  public abstract customId: string;
  public data: ComponentBuilder;

  constructor(manager: Manager, plugin?: T) {
    super(manager, plugin);

    this.data = this.build();
  }

  public build(): ComponentBuilder {
    return new ComponentBuilder();
  }

  public abstract execute(interaction: AnySelectMenuInteraction<'cached'> | ButtonInteraction<'cached'> | ModalSubmitInteraction<'cached'>, user: User): Promise<void | any>
}