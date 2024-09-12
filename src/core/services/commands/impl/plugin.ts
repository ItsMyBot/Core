import { hyperlink, hideLinkEmbed, AutocompleteInteraction } from 'discord.js';
import { CommandInteraction } from "@contracts";
import Utils from '@utils';
import { CommandBuilder } from '@builders';
import { Pagination } from '@utils';
import { Command, User, Plugin } from '@itsmybot';
import PluginModel from '../../plugins/plugin.model.js';

export default class PluginCommand extends Command {
  build() {
    const command = this.manager.configs.commands.getSubsection("plugin");

    return new CommandBuilder()
      .setName('plugin')
      .using(command)
      .addSubcommand(subcommand =>
        subcommand
          .setName('list')
          .setDescription(command.getString("subcommands.list.description")))
      .addSubcommand(subcommand =>
        subcommand
          .setName('enable')
          .setDescription(command.getString("subcommands.enable.description"))
          .addStringOption(option =>
            option.setName("plugin")
              .setDescription(command.getString("subcommands.enable.options.plugin"))
              .setRequired(true)
              .setAutocomplete(true)))
      .addSubcommand(subcommand =>
        subcommand
          .setName('disable')
          .setDescription(command.getString("subcommands.disable.description"))
          .addStringOption(option =>
            option.setName("plugin")
              .setDescription(command.getString("subcommands.disable.options.plugin"))
              .setRequired(true)
              .setAutocomplete(true)))
  }

  async autocomplete(interaction: AutocompleteInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const focusedValue = interaction.options.getFocused();
    const enabled = subcommand === "enable" ? 0 : 1;

    let allPlugins = await PluginModel.findAll({
      where: { enabled: enabled }
    });

    if (focusedValue) {
      allPlugins = allPlugins.filter((plugin: { name: string; }) => plugin.name.includes(focusedValue));
    }

    const choices = allPlugins.map((plugin: { name: string; }) => {
      return { name: plugin.name, value: plugin.name };
    });

    await interaction.respond(choices);
  }

  async execute(interaction: CommandInteraction, user: User) {
    const subcommand = interaction.options.getSubcommand();
    const lang = this.manager.configs.lang;

    switch (subcommand) {
      case 'enable':
      case 'disable':
        const pluginName = interaction.options.getString("plugin", true);
        const plugin = await PluginModel.findOne({ where: { name: pluginName } });

        if (!plugin) {
          return interaction.reply(await Utils.setupMessage({
            config: lang.getSubsection("plugin.not-found"),
            variables: [
              { searchFor: "%plugin_name%", replaceWith: pluginName }
            ],
            context: {
              user: user,
              guild: interaction.guild || undefined,
              channel: interaction.channel || undefined
            }
          }));
        }

        if (plugin.enabled && subcommand === "enable" || !plugin.enabled && subcommand === "disable") {
          return interaction.reply(await Utils.setupMessage({
            config: lang.getSubsection(`plugin.already-${subcommand}d`),
            variables: [
              { searchFor: "%plugin_name%", replaceWith: pluginName }
            ],
            context: {
              user: user,
              guild: interaction.guild || undefined,
              channel: interaction.channel || undefined
            }
          }));
        }

        await plugin.update({ enabled: subcommand === "enable" ? true : false });

        interaction.reply(await Utils.setupMessage({
          config: lang.getSubsection(`plugin.${subcommand}d`),
          variables: [
            { searchFor: "%plugin_name%", replaceWith: pluginName }
          ],
          context: {
            user: user,
            guild: interaction.guild || undefined,
            channel: interaction.channel || undefined
          }
        }));
        break;

      case 'list':
        const getPluginDetails = (plugin: Plugin) => {
          const status = plugin.enabled ? '✅' : '❌';
          const description = plugin.description ? `- ${plugin.description}` : '';
          const authors = plugin.authors ? `- Authors: ${plugin.authors.join(', ')}` : '';
          const website = plugin.website ? `- ${hyperlink("Website", hideLinkEmbed(plugin.website))}` : '';

          return {
            label: plugin.name,
            emoji: status,
            message: [
              `### ${status} ${plugin.name} v${plugin.version}`,
              description,
              authors,
              website,
            ].filter(Boolean).join("\n")
          };
        };

        const plugins = this.manager.services.plugin.plugins.map(getPluginDetails);

        new Pagination(interaction, plugins, lang.getSubsection("plugin.list"))
          .setContext({
            user: user,
            guild: interaction.guild,
            channel: interaction.channel || undefined
          })
          .send();

        break;
    }
  }
}
