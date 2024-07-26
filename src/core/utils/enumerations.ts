import { ButtonStyle, ActivityType, TextInputStyle, PresenceStatusData, PermissionFlagsBits, ChannelType, ApplicationCommandOptionType } from 'discord.js';


function checkEnum(value: string, data: { [key: string]: string[] }): string | undefined {
  if (!value) return undefined;

  const normalizedValue = value.toLowerCase().replace(/[_-\s]/g, '');

  for (const [canonical, options] of Object.entries(data)) {
    if (options.includes(normalizedValue)) {
      return canonical;
    }
  }
  return undefined;
}

const permissionFlagsValue = {
  'AddReactions': ['addreactions', 'addreaction'],
  'Administrator': ['administrator', 'admin', '*'],
  'AttachFiles': ['attachfiles', 'attachfile'],
  'BanMembers': ['banmembers', 'banmember'],
  'ChangeNickname': ['changenickname'],
  'Connect': ['connect', 'join'],
  'CreateEvents': ['createevents', 'createevent'],
  'CreateGuildExpressions': ['createguildexpressions', 'createguildexpression'],
  'CreateInstantInvite': ['createinstantinvite', 'createinvite'],
  'CreatePrivateThreads': ['createprivatethreads', 'createprivatethread'],
  'CreatePublicThreads': ['createpublicthreads', 'createpublicthread'],
  'DeafenMembers': ['deafenmembers', 'deafenmember'],
  'EmbedLinks': ['embedlinks', 'embedlink'],
  'KickMembers': ['kickmembers', 'kickmember'],
  'ManageChannels': ['managechannels', 'managechannel'],
  'ManageEvents': ['manageevents', 'manageevent'],
  'ManageGuild': ['manageguild'],
  'ManageGuildExpressions': ['manageguildexpressions', 'manageguildexpression'],
  'ManageMessages': ['managemessages', 'managemessage'],
  'ManageNicknames': ['managenicknames', 'managenickname'],
  'ManageRoles': ['manageroles', 'managerole'],
  'ManageThreads': ['managethreads', 'managethread'],
  'ManageWebhooks': ['managewebhooks', 'managewebhook'],
  'MentionEveryone': ['mentioneveryone',],
  'ModerateMembers': ['moderatemembers', 'moderatemember'],
  'MoveMembers': ['movemembers', 'movemember'],
  'MuteMembers': ['mutemembers', 'mutemember'],
  'PrioritySpeaker': ['priorityspeaker'],
  'ReadMessageHistory': ['readmessagehistory'],
  'RequestToSpeak': ['requesttospeak'],
  'SendMessages': ['sendmessages', 'sendmessage'],
  'SendMessagesInThreads': ['sendmessagesinthreads', 'sendmessagesinthread'],
  'SendTTSMessages': ['sendttsmessages', 'sendttsmessage'],
  'SendVoiceMessages': ['sendvoicemessages', 'sendvoicemessage',],
  'Speak': ['speak', 'talk'],
  'Stream': ['stream'],
  'UseApplicationCommands': ['useapplicationcommands', 'useapplicationcommand'],
  'UseEmbeddedLinks': ['useembeddedlinks', 'useembeddedlink'],
  'UseExternalEmojis': ['useexternalemojis', 'useexternalemoji'],
  'UseExternalSounds': ['useexternalsounds', 'useexternalsound'],
  'UseExternalStickers': ['useexternalstickers', 'useexternalsticker'],
  'UseSoundboard': ['usesoundboard'],
  'UseVAD': ['usevad'],
  'ViewAuditLog': ['viewauditlog'],
  'ViewChannel': ['viewchannel'],
  'ViewCreatorMonetizationAnalytics': ['viewcreatormonetizationanalytics'],
  'ViewGuildInsights': ['viewguildinsights'],
};
export function permissionFlags(value: string): bigint | undefined {
  const result = checkEnum(value, permissionFlagsValue)
  return result ? PermissionFlagsBits[result as keyof typeof PermissionFlagsBits] : undefined
}

const buttonStyleValue = {
  'Primary': ['primary', 'blue', '1'],
  'Secondary': ['secondary', 'grey', '2'],
  'Success': ['success', 'green', '3'],
  'Danger': ['danger', 'red', '4'],
  'Link': ['link', 'url', '5'],
};
export function buttonStyle(value: string): ButtonStyle | undefined {
  const result = checkEnum(value, buttonStyleValue)
  return result ? ButtonStyle[result as keyof typeof ButtonStyle] : undefined
}

const textInputStyleValue = {
  'Short': ['short', '1', 'singleline'],
  'Paragraph': ['paragraph', '2', 'multiline'],
}
export function textInputStyle(value: string): TextInputStyle | undefined {
  const result = checkEnum(value, textInputStyleValue)
  return result ? TextInputStyle[result as keyof typeof TextInputStyle] : undefined
}

const activityTypeValue = {
  'Playing': ['playing', 'play', '0'],
  'Streaming': ['streaming', 'stream', '1'],
  'Listening': ['listening', 'listen', '2'],
  'Watching': ['watching', 'watch', '3'],
  'Custom': ['custom', '4'],
  'Competing': ['competing', 'compete', '5'],
};
export function activityType(value: string): ActivityType | undefined {
  const result = checkEnum(value, activityTypeValue)
  return result ? ActivityType[result as keyof typeof ActivityType] : undefined
}

const presenceStatusValue = {
  'invisible': ['invisible', '0', 'offline'],
  'dnd': ['donotdisturb', 'dnd', '1'],
  'idle': ['idle', '2', 'away', 'afk'],
  'online': ['online', '3', 'available', 'on'],
};
export function presenceStatus(value: string): PresenceStatusData | undefined {
  const result = checkEnum(value, presenceStatusValue)
  return result ? result as PresenceStatusData : undefined
}

const commandOptionTypeValue = {
  'String': ['string', '3'],
  'Integer': ['integer', '4'],
  'Boolean': ['boolean', '5'],
  'User': ['user', '6'],
  'Channel': ['channel', '7'],
  'Role': ['role', '8'],
  'Mentionable': ['mentionable', '9'],
  'Number': ['number', '10'],
  'Attachement': ['attachement', '11'],
}
export function commandOptionType(value: string): ApplicationCommandOptionType | undefined {
  const result = checkEnum(value, commandOptionTypeValue)
  return result ? ApplicationCommandOptionType[result as keyof typeof ApplicationCommandOptionType] : undefined
}

const channelTypeValue = {
  'GuildText': ['GuildText', '0'],
  'DM': ['DM', '1'],
  'GuildVoice': ['GuildVoice', '2'],
  'GroupDM': ['GroupDM', '3'],
  'GuildCategory': ['GuildCategory', '4'],
  'GuildAnnouncement': ['GuildAnnouncement', 'GuildNews', '5'],
  'AnnouncementThread': ['AnnouncementThread', 'GuildNewsThread', '10'],
  'PublicThread': ['PublicThread', 'GuildPublicThread', '11'],
  'PrivateThread': ['PrivateThread', 'GuildPrivateThread', '12'],
  'GuildStageVoice': ['GuildStageVoice', '13'],
  'GuildDirectory': ['GuildDirectory', '14'],
  'GuildForum': ['GuildForum', '15'],
  'GuildMedia': ['GuildMedia', '16'],
}
export function channelType(value: string): ChannelType | undefined {
  const result = checkEnum(value, channelTypeValue)
  return result ? ChannelType[result as keyof typeof ChannelType] : undefined
}