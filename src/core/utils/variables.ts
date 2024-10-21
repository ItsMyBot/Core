import { channelMention, roleMention, userMention, time, Role, Guild, Channel, ClientUser } from 'discord.js';
import { User } from '@itsmybot';

export const timeVariables = (timestamp: number, prefix = "time") => {
  return [{
    searchFor: `%${prefix}_short_date%`,
    replaceWith: time(timestamp, "d"),
  }, {
    searchFor: `%${prefix}_long_date%`,
    replaceWith: time(timestamp, "D"),
  }, {
    searchFor: `%${prefix}_short_time%`,
    replaceWith: time(timestamp, "t"),
  }, {
    searchFor: `%${prefix}_long_time%`,
    replaceWith: time(timestamp, "T"),
  }, {
    searchFor: `%${prefix}_short%`,
    replaceWith: time(timestamp, "f"),
  }, {
    searchFor: `%${prefix}_long%`,
    replaceWith: time(timestamp, "F"),
  }, {
    searchFor: `%${prefix}_relative%`,
    replaceWith: time(timestamp, "R"),
  }]
}

export const userVariables = (user: User, prefix = "user") => {
  return [{
    searchFor: `%${prefix}_id%`,
    replaceWith: user.id || "Unknown",
  }, {
    searchFor: `%${prefix}_display_name%`,
    replaceWith: user.displayName,
  }, {
    searchFor: `%${prefix}_username%`,
    replaceWith: user.username,
  }, {
    searchFor: `%${prefix}_mention%`,
    replaceWith: user.mention,
  }, {
    searchFor: `%${prefix}_pfp%`,
    replaceWith: user.avatar,
  }, {
    searchFor: `%${prefix}_create_date%`,
    replaceWith: time(user.createdAt, "D"),
  }, {
    searchFor: `%${prefix}_join_date%`,
    replaceWith: time(user.joinedAt, "D"),
  }, {
    searchFor: `%${prefix}_roles%`,
    replaceWith: user.roles ? user.roles.join(", ") : "None",
  }, {
    searchFor: `%${prefix}_messages%`,
    replaceWith: user.messages,
  }]
}

export const channelVariables = (channel: Channel, prefix = "channel") => {
  return [{
    searchFor: `%${prefix}_id%`,
    replaceWith: channel.id,
  }, {
    searchFor: `%${prefix}_name%`,
    replaceWith: channel.isDMBased() ? "DM" : channel.name,
  }, {
    searchFor: `%${prefix}_mention%`,
    replaceWith: channelMention(channel.id),
  }, {
    searchFor: `%${prefix}_type%`,
    replaceWith: channel.type,
  }, {
    searchFor: `%${prefix}_create_date%`,
    replaceWith: channel.createdTimestamp ? time(Math.round(channel.createdTimestamp / 1000), "D") : "Unknown",
  }, {
    searchFor: `%${prefix}_topic%`,
    replaceWith: !channel.isDMBased() && !channel.isThread() && !channel.isVoiceBased() && channel.isTextBased() ? channel.topic : "None"
  }, {
    searchFor: `%${prefix}_url%`,
    replaceWith: channel.url,
  }]
}

export const roleVariables = (role: Role, prefix = "role") => {
  return [{
    searchFor: `%${prefix}_id%`,
    replaceWith: role.id,
  }, {
    searchFor: `%${prefix}_name%`,
    replaceWith: role.name,
  }, {
    searchFor: `%${prefix}_mention%`,
    replaceWith: roleMention(role.id),
  }]
}

export const guildVariables = (guild: Guild) => {
  return [{
    searchFor: "%guild_id%",
    replaceWith: guild.id
  }, {
    searchFor: "%guild_name%",
    replaceWith: guild.name,
  }, {
    searchFor: "%guild_icon%",
    replaceWith: guild.iconURL({ forceStatic: false }) || "https://cdn.discordapp.com/embed/avatars/0.png",
  }, {
    searchFor: "%guild_boosts%",
    replaceWith: guild.premiumSubscriptionCount?.toString() || "0",
  }, {
    searchFor: "%guild_level%",
    replaceWith: guild.premiumTier.toString(),
  }, {
    searchFor: "%guild_create_date%",
    replaceWith: time(Math.round(guild.createdTimestamp / 1000), "D"),
  }, {
    searchFor: "%guild_members%",
    replaceWith: guild.members.cache.filter((m) => !m.user.bot).size.toString(),
  }, {
    searchFor: "%guild_bots%",
    replaceWith: guild.members.cache.filter((m) => m.user.bot).size.toString(),
  }, {
    searchFor: "%guild_users%",
    replaceWith: guild.memberCount.toString(),
  }, {
    searchFor: "%guild_roles%",
    replaceWith: guild.roles.cache.size.toString(),
  }, {
    searchFor: "%guild_channels%",
    replaceWith: guild.channels.cache.size.toString(),
  }, {
    searchFor: "%guild_emojis%",
    replaceWith: guild.emojis.cache.size.toString(),
  }, {
    searchFor: "%guild_stickers%",
    replaceWith: guild.stickers.cache.size.toString(),
  }, {
    searchFor: "%guild_online_users%",
    replaceWith: guild.members.cache.filter((m) => m.presence?.status !== "offline").size.toString(),
  }, {
    searchFor: "%guild_online_bots%",
    replaceWith: guild.members.cache.filter((m) => m.presence?.status !== "offline" && m.user.bot).size.toString(),
  }, {
    searchFor: "%guild_online_members%",
    replaceWith: guild.members.cache.filter((m) => m.presence?.status == "online" && !m.user.bot).size.toString(),
  }, {
    searchFor: "%guild_idle_members%",
    replaceWith: guild.members.cache.filter((m) => m.presence?.status == "idle" && !m.user.bot).size.toString(),
  }, {
    searchFor: "%guild_dnd_members%",
    replaceWith: guild.members.cache.filter((m) => m.presence?.status == "dnd" && !m.user.bot).size.toString(),
  }, {
    searchFor: "%guild_offline_members%",
    replaceWith: guild.members.cache.filter((m) => m.presence?.status == "offline" && !m.user.bot).size.toString(),
  }]
}

export const botVariables = (bot: ClientUser) => {
  return [{
    searchFor: `%bot_id%`,
    replaceWith: bot.id ?? "Unknown",
  }, {
    searchFor: `%bot_username%`,
    replaceWith: bot.username ?? "Unknown",
  }, {
    searchFor: `%bot_mention%`,
    replaceWith: userMention(bot.id),
  }, {
    searchFor: `%bot_pfp%`,
    replaceWith: bot.displayAvatarURL({ forceStatic: false }),
  }]
}