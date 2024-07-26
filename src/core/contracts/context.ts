import { Plugin, User } from '@itsmybot';
import { Channel, Guild, GuildMember, Interaction, Message, Role } from 'discord.js';

export interface Context {
  user?: User;
  member?: GuildMember;
  channel?: Channel
  message?: Message;
  guild?: Guild;
  content?: string;
  plugin?: Plugin;
  interaction?: Interaction;
  role?: Role;
}