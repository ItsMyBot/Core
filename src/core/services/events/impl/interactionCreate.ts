import Utils from '@utils';
import { Command, Event, User } from '@itsmybot';
import { Events, Context } from '@contracts';
import { Interaction, RepliableInteraction } from 'discord.js';
export default class InteractionCreateEvent extends Event {
  name = Events.InteractionCreate;

  public async execute(interaction: Interaction<'cached'>) {

    const user = interaction.member ? await this.manager.services.user.findOrCreate(interaction.member)
      : await this.manager.services.user.findOrNull(interaction.user.id) as User;
    if (interaction.isChatInputCommand()) {
      const command = this.manager.services.command.getCommand(interaction.commandName);
      if (!command) return

      const requirementsMet = await this.checkRequirements(interaction, command, user);
      if (!requirementsMet) return;

      try {
        await command.execute(interaction, user);
      } catch (error: any) {
        this.manager.logger.error(`Error executing command '${command.data.name}'`, error, error.stack)
      }

      command.data.cooldown.setCooldown(interaction.user.id);
    } else if (interaction.isMessageContextMenuCommand()) {
      const command = this.manager.services.command.getCommand(interaction.commandName);

      if (!command) return
      try {
        await command.execute(interaction, user);
      } catch (error: any) {
        this.manager.logger.error(`Error executing command '${command.data.name}'`, error, error.stack)
      }

    } else if (interaction.isAutocomplete()) {
      const command = this.manager.services.command.getCommand(interaction.commandName);

      if (!command || !command.autocomplete) return

      try {
        await command.autocomplete(interaction);
      } catch (error: any) {
        this.manager.logger.error(`Error autocomplete command '${command.data.name}'`, error.stack)
      }
    } else if (interaction.isButton()) {
      const button = this.manager.services.component.getButton(interaction.customId);
      if (!button) return this.manager.client.emit(Events.Button, interaction, user);

      const requirementsMet = await this.checkRequirements(interaction, button, user);
      if (!requirementsMet) return;

      if (!button.data.public) {
        if (interaction.guildId !== this.manager.primaryGuildId)
          return interaction.reply(await Utils.setupMessage({
            config: this.manager.configs.lang.getSubsection("only-in-primary-guild"),
            context: {
              user
            }
          }));
      }

      try {
        await button.execute(interaction, user);
      } catch (error: any) {
        this.manager.logger.error(`Error executing button '${button.name}'`, error, error.stack)
      }

      button.data.cooldown.setCooldown(interaction.user.id);
    } else if (interaction.isStringSelectMenu()) {
      const selectMenu = this.manager.services.component.getSelectMenu(interaction.customId);
      if (!selectMenu) return this.manager.client.emit(Events.SelectMenu, interaction, user);

      const requirementsMet = await this.checkRequirements(interaction, selectMenu, user);
      if (!requirementsMet) return;

      if (!selectMenu.data.public) {
        if (interaction.guildId !== this.manager.primaryGuildId)
          return interaction.reply(await Utils.setupMessage({
            config: this.manager.configs.lang.getSubsection("only-in-primary-guild"),
            context: {
              user
            }
          }));
      }

      try {
        await selectMenu.execute(interaction, user);
      } catch (error: any) {
        this.manager.logger.error(`Error executing selectMenu '${selectMenu.name}'`, error, error.stack)
      }

      selectMenu.data.cooldown.setCooldown(interaction.user.id);
    } else if (interaction.isModalSubmit()) {
      const modal = this.manager.services.component.getModal(interaction.customId);
      if (!modal) return this.manager.client.emit(Events.ModalSubmit, interaction, user);

      const requirementsMet = await this.checkRequirements(interaction, modal, user);
      if (!requirementsMet) return;

      if (!modal.data.public) {
        if (interaction.guildId !== this.manager.primaryGuildId)
          return interaction.reply(await Utils.setupMessage({
            config: this.manager.configs.lang.getSubsection("only-in-primary-guild"),
            context: {
              user,
            }
          }));
      }

      try {
        await modal.execute(interaction, user);
      } catch (error: any) {
        this.manager.logger.error(`Error executing modal '${modal.name}'`, error, error.stack)
      }

      modal.data.cooldown.setCooldown(interaction.user.id);
    }
  }

  async checkRequirements(interaction: RepliableInteraction<'cached'>, component: Command, user: User) {
    if (!interaction.member) return true;
    if (!interaction.channel) return true;
    if (interaction.channel.isDMBased()) return true;

    const member = interaction.member;

    const context: Context = {
      user: user,
      member: member,
      guild: interaction.guild || undefined,
      channel: interaction.channel || undefined
    }

    if (component.data.cooldown.isOnCooldown(interaction.user.id)) {
      await interaction.reply(await Utils.setupMessage({
        config: this.manager.configs.lang.getSubsection("interaction.in-cooldown"),
        variables: [
          { searchFor: "%cooldown%", replaceWith: component.data.cooldown.endsAtFormatted(interaction.user.id) },
        ],
        context
      }));
      return false;
    }

    const hasRole = await Utils.hasRole(member, component.data.requiredRoles, component.data.inherited);
    if (component.data.requiredRoles.length && !hasRole) {
      await interaction.reply(await Utils.setupMessage({
        config: this.manager.configs.lang.getSubsection("interaction.no-permission"),
        context
      }));
      return false;
    }

    if (component.data.requiredUsers.length) {
      const userId = interaction.user.id;
      const username = interaction.user.username.toLowerCase();

      if (!component.data.requiredUsers.some((requiredUser: string) =>
        requiredUser === userId || requiredUser.toLowerCase() === username)) {

        await interaction.reply(await Utils.setupMessage({
          config: this.manager.configs.lang.getSubsection("interaction.no-permission"),
          context
        }));
        return false;
      }
    }

    if (component.data.requiredChannels.length) {
      const channelId = interaction.channel.id;
      const channelName = interaction.channel.name.toLowerCase();

      if (!component.data.requiredChannels.some((requiredChannel: string) =>
        requiredChannel === channelId || requiredChannel.toLowerCase() === channelName)) {

        const channels = component.data.requiredChannels.map((channelIdOrName: string) => {
          return channelIdOrName.match(/^\d+$/) ? `<#${channelIdOrName}>` : channelIdOrName;
        }).join(', ');

        await interaction.reply(await Utils.setupMessage({
          config: this.manager.configs.lang.getSubsection("interaction.channel-restricted"),
          variables: [
            { searchFor: "%channels%", replaceWith: channels },
          ],
          context
        }));
        return false;
      }
    }

    if (component.data.permissions.length) {
      const permissions = member.permissionsIn(interaction.channel);

      const missingPermissions = component.data.permissions.filter((permission: bigint) => !permissions.has(permission));
      if (missingPermissions.length) {
        await interaction.reply(await Utils.setupMessage({
          config: this.manager.configs.lang.getSubsection("interaction.no-permission"),
          context
        }));
        return false;
      }
    }

    return true;
  }
};