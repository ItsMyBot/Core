import { CommandInteraction } from '@contracts';
import { Plugin, User } from '@itsmybot';
import { Channel, Guild, GuildMember, Message, MessageComponentInteraction, Role } from 'discord.js';

export interface Context {
  user?: User;
  member?: GuildMember;
  channel?: Channel
  message?: Message;
  guild?: Guild;
  content?: string;
  plugin?: Plugin;
  interaction?: CommandInteraction | MessageComponentInteraction;
  role?: Role;
}