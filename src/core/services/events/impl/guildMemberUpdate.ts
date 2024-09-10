import { Event } from '@itsmybot';
import { GuildMember } from 'discord.js';
import { Context, Events } from '@contracts';

export default class GuildMemberUpdateEvent extends Event {
  name = Events.GuildMemberUpdate;
  priority = 5;

  async execute(oldMember: GuildMember, newMember: GuildMember) {
    if (newMember.guild.id !== this.manager.primaryGuildId) return;
    if (oldMember === newMember) return;

    const user = await this.manager.services.user.findOrCreate(newMember);
    if (oldMember.pending && !newMember.pending) {
      const context: Context = {
        member: newMember,
        user: user,
        guild: newMember.guild,
        content: newMember.displayName
      };
      
      this.manager.services.engine.event.emit('guildMemberAdd', context);
    }
  }
};