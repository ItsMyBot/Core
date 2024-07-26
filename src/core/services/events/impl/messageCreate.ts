import { Message } from 'discord.js';
import { Event } from '@itsmybot';
import { Context, Events } from '@contracts'

export default class MessageCreateEvent extends Event {
  name = Events.MessageCreate;

  async execute(message: Message) {
    if (!message.guild || message.guild.id !== this.manager.primaryGuildId) return;
    const user = message.member ? await this.manager.services.user.findOrCreate(message.member) : await this.manager.services.user.findOrNull(message.author.id);

    if (!user) return

    const context: Context = {
      message: message,
      member: message.member || undefined,
      user: user,
      guild: message.guild,
      channel: message.channel,
      content: message.content
    };

    await user.increment('messages');

    this.manager.services.engine.handleEvent('messageCreate', context);
  }
};
