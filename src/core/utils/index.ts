import { permissionFlags, buttonStyle, activityType, textInputStyle, presenceStatus, commandOptionType, channelType } from './enumerations.js';
import * as fs from 'fs/promises';
import { findRole, findChannel, findTextChannel } from './find.js';
import { setupEmbed } from './setup/setupEmbed.js';
import { setupMessage } from './setup/setupMessage.js';
import { setupComponent } from './setup/setupComponent.js';
import { setupButton } from './setup/setupButton.js';
import { setupModal } from './setup/setupModal.js';
import { userVariables, channelVariables, roleVariables, timeVariables } from './variables.js';

export { Logger } from './logger/index.js';
export { Cooldown } from './cooldown.js';
export { Pagination } from './pagination.js';

import manager from '@itsmybot';

import { GuildMember } from 'discord.js';
import { Context, Variable, MessageOutput } from '@contracts';

const discordEpoch = 1420070400000;

export default {
  permissionFlags,
  buttonStyle,
  activityType,
  textInputStyle,
  presenceStatus,
  commandOptionType,
  channelType,

  findRole,
  findChannel,
  findTextChannel,

  setupEmbed,
  setupMessage,
  setupComponent,
  setupButton,
  setupModal,

  userVariables,
  channelVariables,
  roleVariables,
  timeVariables,

  async fileExists(filePath: string) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  },

  async applyVariables(value: string | undefined, variables: Variable[], context?: Context) {
    if (!value) return ""

    if (context?.user) variables.push(...this.userVariables(context.user));
    if (context?.channel) variables.push(...this.channelVariables(context.channel));
    if (context?.role) variables.push(...this.roleVariables(context.role));
    if (context?.content) variables.push({ searchFor: "%content%", replaceWith: context.content })
    if (context?.message) variables.push(
      { searchFor: "%message_content%", replaceWith: context.message.content },
      { searchFor: "%message_url%", replaceWith: context.message.url })

    variables.forEach((variable) => {
      if (!value) return "";
      value = value.replaceAll(variable.searchFor, variable.replaceWith?.toString() || 'undefined');
    });

    return manager.services.expansion.resolvePlaceholders(value, context);
  },

  async wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  isValidURL(url: string) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  getRandom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  },

  removeHiddenLines(text: string) {
    let texts = text.split('\n');

    texts = texts.filter((line) => !line.startsWith('show=false '));
    texts = texts.map((line) => line.replace('show=true ', ''));

    return texts.join('\n');
  },

  async hasRole(member: GuildMember, identifiers: string, inherited = false) {
    const searchIdentifiers = Array.isArray(identifiers) ? identifiers : [identifiers];

    for (const identifier of searchIdentifiers) {
      const search = String(identifier).toLowerCase();

      if (search === '@everyone') return true;

      const hasSpecificRole = member.roles.cache.some(r => r.name.toLowerCase() === search || r.id === search);
      if (hasSpecificRole) return true;

      if (inherited) {
        const targetRole = member.guild.roles.cache.find(r => r.name.toLowerCase() === search || r.id === search);
        if (targetRole) {
          const hasHigherRole = member.roles.cache.some(r => r.position > targetRole.position);
          if (hasHigherRole) return true;
        }
      }
    }

    return false;
  },

  generateSnowflake() {
    let timestamp = Date.now();
    timestamp -= discordEpoch;

    return (BigInt(timestamp) << 22n).toString();
  },

  getDateFromSnowflake(snowflake: string | number | bigint) {
    const binary = BigInt(snowflake).toString(2);
    const timestamp = parseInt(binary.substring(0, binary.length - 22), 2) + discordEpoch;
    return new Date(timestamp);
  },

  formatTime(seconds: number) {
    const timeUnits: { [key: string]: number } = {
      month: 30 * 24 * 60 * 60,
      day: 24 * 60 * 60,
      hour: 60 * 60,
      minute: 60
    };

    let remainingSeconds = seconds;
    const result = [];

    for (const unit in timeUnits) {
      if (remainingSeconds >= timeUnits[unit]) {
        const value = Math.floor(remainingSeconds / timeUnits[unit]);
        remainingSeconds -= value * timeUnits[unit];
        result.push({ value, unit });
      }
    }

    if (remainingSeconds > 0) {
      result.push({ value: remainingSeconds, unit: 'second' });
    }

    return result.slice(0, 3).map(({ value, unit }) => {
      if (result.length === 1) {
        return value === 1 ? `${value} ${unit}` : `${value} ${unit}s`;
      }
      return `${value}${unit.charAt(0)}`;
    }).join(' ');
  },

  parseTime(time: string): number {
    const timeUnits: { [key: string]: number } = {
      d: 24 * 60 * 60,
      h: 60 * 60,
      m: 60
    };

    const matches = time.match(/(\d+)([a-z]+)/g);
    if (!matches) return 0;

    let result = 0;
    for (const match of matches) {
      const value = parseInt(match);
      const unit = match.replace(value.toString(), '');
      result += value * timeUnits[unit];
    }

    return result * 1000;
  },
  async logToDiscord(id: string, message: MessageOutput) {
    const log = manager.configs.config.getSubsections('log-channels').find(log => log.getString("id") === id);
    if (!log) return;

    const channel = await findTextChannel(log.getString('channel'));
    if (!channel) return;

    channel.send(message)
  }
};