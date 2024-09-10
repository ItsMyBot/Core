import { Event } from '@itsmybot';
import { GuildMember } from 'discord.js';
import { Events } from '@contracts';

export default class GuildMemberAddEvent extends Event {
  name = Events.GuildMemberAdd;
  priority = 5;

  async execute(member: GuildMember) {
    if (member.guild.id !== this.manager.primaryGuildId) return;
    await this.manager.services.user.findOrCreate(member);
  }
};