import Utils from '@utils';
import { CommandBuilder } from '@builders';
import { Command, Config, Manager, User } from '@itsmybot';
import { Context, CommandInteraction } from '@contracts';

export default class PluginCommand extends Command {
  lang: Config;
  command: Config;

  public constructor(manager: Manager) {
    super(manager);
    this.lang = manager.configs.lang;
    this.command = manager.configs.commands.getSubsection("parse");

    this.data = new CommandBuilder()
      .setName('parse')
      .setConfig(this.command)
      .addStringOption(option =>
        option.setName("text")
          .setDescription(this.command.getString("options.text"))
          .setRequired(true))
      .addUserOption(option =>
        option.setName("user")
          .setDescription(this.command.getString("options.user"))
          .setRequired(false))
  }

  async execute(interaction: CommandInteraction, user: User) {
    const target = interaction.options.getMember("user")
    const targetUser = target ? await this.manager.services.user.findOrCreate(target) : user;

    const context: Context = {
      user: targetUser,
      guild: interaction.guild || undefined,
      channel: interaction.channel || undefined
    }

    const text = await Utils.applyVariables(interaction.options.getString("text", true), [], context);

    interaction.reply(await Utils.setupMessage({
      config: this.lang.getSubsection("parsed"),
      variables: [
        { searchFor: "%parsed_text%", replaceWith: text },
      ],
      context: context,
    }))
  }
}
