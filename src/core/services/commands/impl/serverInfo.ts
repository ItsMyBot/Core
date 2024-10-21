import Utils from '@utils';
import { CommandBuilder } from '@builders';
import { Command, User } from '@itsmybot';
import { CommandInteraction } from "@contracts";

export default class ServerInfoCommand extends Command {
  build() {
    return new CommandBuilder()
      .setName('server-info')
      .using(this.manager.configs.commands.getSubsection("server-info"))
  }

  async execute(interaction: CommandInteraction, user: User) {
    const owner = await interaction.guild?.fetchOwner({ force: true })
    const ownerUser = owner ? await this.manager.services.user.findOrCreate(owner) : user;

    interaction.reply(await Utils.setupMessage({
      config: this.manager.configs.lang.getSubsection("server-info"),
      variables: [
        ...Utils.userVariables(ownerUser, "owner"),
      ],
      context: {
        user: user,
        guild: interaction.guild || undefined,
        channel: interaction.channel || undefined
      }
    }))
  }
}
