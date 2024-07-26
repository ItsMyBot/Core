import { Events, Context } from '@contracts';
import { Event } from '@itsmybot';
import { Message, MessageReaction, User } from 'discord.js';

export default class MessageReactionAddEvent extends Event {
  name = Events.MessageReactionAdd;

  async execute(messageReaction: MessageReaction, user: User) {
    if (!messageReaction.message.guildId || messageReaction.message.guildId !== this.manager.primaryGuildId) return;
    const member = messageReaction.message.guild?.members.cache.get(user.id);
    if (member) await this.manager.services.user.findOrCreate(member);
    const userInstance = await this.manager.services.user.find(user.id);


    const context: Context = {
      user: userInstance,
      guild: messageReaction.message.guild || undefined,
      message: messageReaction.message as Message,
      channel: messageReaction.message.channel,
      content: messageReaction.emoji.name || undefined
    };

    if (member) context.member = member;

    this.manager.services.engine.handleEvent('messageReactionAdd', context);
  }
};