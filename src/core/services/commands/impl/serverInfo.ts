import Utils from '@utils';
import { CommandBuilder } from '@builders';
import { Manager, Command, Config, User } from '@itsmybot';
import { CommandInteraction } from "@contracts";

export default class ServerInfoCommand extends Command {
  lang: Config;

  constructor(manager: Manager) {
    super(manager);
    this.lang = manager.configs.lang;

    this.data = new CommandBuilder()
      .setName('server-info')
      .setConfig(manager.configs.commands.getSubsection("server-info"))
  }
  async execute(interaction: CommandInteraction, user: User) {
    const owner = await interaction.guild?.fetchOwner({ force: true })
    const ownerUser = owner ? await this.manager.services.user.findOrCreate(owner) : user;

    interaction.reply(await Utils.setupMessage({
      config: this.lang.getSubsection("server-info"),
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
