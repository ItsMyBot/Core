import { Context } from '@contracts';
import { Expansion } from '../expansion.js';
import { userMention } from 'discord.js';

export class BotExpansion extends Expansion {

  async onRequest(context: Context, placeholder: string) {
    const bot = this.manager.client.user;
    
    switch (placeholder) {
      case 'id':
        return bot.id;
      case 'username':
        return bot.username;
      case 'mention':
        return userMention(bot.id);
      case 'pfp':
        return bot.displayAvatarURL({ forceStatic: false });
    }
  }
}