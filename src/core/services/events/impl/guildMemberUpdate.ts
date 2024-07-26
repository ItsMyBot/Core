import { Events } from '@contracts';
import { Event } from '@itsmybot';
import { GuildMember } from 'discord.js';

export default class GuildMemberUpdateEvent extends Event {
  name = Events.GuildMemberUpdate;

  async execute(oldMember: GuildMember, newMember: GuildMember) {
    if (newMember.guild.id !== this.manager.primaryGuildId) return;
    await this.manager.services.user.findOrCreate(newMember);
  }
};