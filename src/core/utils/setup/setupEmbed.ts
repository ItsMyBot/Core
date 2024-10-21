import { ColorResolvable, EmbedBuilder } from 'discord.js';
import manager from '@itsmybot';
import { Config } from '@itsmybot';
import Utils from '@utils';
import { Context, Variable } from '@contracts';

interface EmbedSettings {
  config: Config,
  variables?: Variable[],
  context: Context
}

export async function setupEmbed(settings: EmbedSettings) {
  const variables = settings.variables || []
  const context = settings.context;
  const config = settings.config;

  let author = config.getStringOrNull("author") || config.getStringsOrNull("author");
  let authorIcon = config.getStringOrNull("author-icon") || config.getStringsOrNull("author-icon");
  let authorUrl = config.getStringOrNull("author-url") || config.getStringsOrNull("author-url");
  let url = config.getStringOrNull("url") || config.getStringsOrNull("url");
  let title = config.getStringOrNull("title") || config.getStringsOrNull("title");
  let description = config.getStringOrNull("description") || config.getStringsOrNull("description");
  const fields = config.getSubsectionsOrNull("fields");
  let footer = config.getStringOrNull("footer") || config.getStringsOrNull("footer");
  let footerIcon = config.getStringOrNull("footer-icon") || config.getStringsOrNull("footer-icon");
  let thumbnail = config.getStringOrNull("thumbnail") || config.getStringsOrNull("thumbnail");
  let image = config.getStringOrNull("image") || config.getStringsOrNull("image");
  let timestamp = config.getStringOrNull("timestamp");
  let color = config.getStringOrNull("color") || config.getStringsOrNull("color") || manager.configs.config.getString("default-color");

  if (Array.isArray(author)) author = Utils.getRandom(author);
  if (Array.isArray(authorIcon)) authorIcon = Utils.getRandom(authorIcon);
  if (Array.isArray(authorUrl)) authorUrl = Utils.getRandom(authorUrl);
  if (Array.isArray(url)) url = Utils.getRandom(url);
  if (Array.isArray(title)) title = Utils.getRandom(title);
  if (Array.isArray(description)) description = Utils.getRandom(description);
  if (Array.isArray(footer)) footer = Utils.getRandom(footer);
  if (Array.isArray(footerIcon)) footerIcon = Utils.getRandom(footerIcon);
  if (Array.isArray(thumbnail)) thumbnail = Utils.getRandom(thumbnail);
  if (Array.isArray(image)) image = Utils.getRandom(image);
  if (Array.isArray(color)) color = Utils.getRandom(color);

  const embed = new EmbedBuilder()
    .setTitle(await Utils.applyVariables(title, variables, context) || null)
    .setDescription(await Utils.applyVariables(description, variables, context) || null)
    .setAuthor({
      name: await Utils.applyVariables(author, variables, context) || null!,
      iconURL: await Utils.applyVariables(authorIcon, variables, context) || undefined,
      url: await Utils.applyVariables(authorUrl, variables, context) || undefined,
    })
    .setFooter({
      text: await Utils.applyVariables(footer, variables, context) || null!,
      iconURL: await Utils.applyVariables(footerIcon, variables, context) || undefined,
    })
    .setImage(await Utils.applyVariables(image, variables, context) || null)
    .setThumbnail(await Utils.applyVariables(thumbnail, variables, context) || null)
    .setTimestamp(timestamp ? Date.now() : null)
    .setColor(await Utils.applyVariables(color, variables, context) as ColorResolvable || null)
    .setURL(await Utils.applyVariables(url, variables, context) || null);

  if (Array.isArray(fields) && fields.length) {
    for (const field of fields) {

      embed.addFields({
        name: await Utils.applyVariables(field.getString("name"), variables, context),
        value: await Utils.applyVariables(field.getString("value"), variables, context),
        inline: field.getBoolOrNull("inline") || false,
      });
    }
  }

  return embed.data;
};
