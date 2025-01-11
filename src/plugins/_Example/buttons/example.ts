import { ComponentBuilder } from '@builders';
import TicketsPlugin from '..';
import { User, Component } from '@itsmybot';
import { ButtonInteraction } from 'discord.js';

export default class ExampleButton extends Component<TicketsPlugin> {
  customId = 'example_id';

  build() {
    return new ComponentBuilder() // Can use the same command as the slash command usefull to keep the same permissions and requirements
      .using(this.plugin.configs.commands.getSubsection("example")) 
  }

  async execute(interaction: ButtonInteraction<'cached'>, user: User) {
    
  }
}