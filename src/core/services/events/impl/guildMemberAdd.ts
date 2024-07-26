import { Event } from '@itsmybot';
import { GuildMember } from 'discord.js';
import { Context, Events } from '@contracts';

export default class GuildMemberAddEvent extends Event {
  name = Events.GuildMemberAdd;
  priority = 5;

  async execute(member: GuildMember) {
    if (member.guild.id !== this.manager.primaryGuildId) return;
    const user = await this.manager.services.user.findOrCreate(member);

    const context: Context = {
      member: member,
      user: user,
      guild: member.guild,
      content: member.displayName
    };

    this.manager.services.engine.handleEvent('guildMemberAdd', context);
  }
};