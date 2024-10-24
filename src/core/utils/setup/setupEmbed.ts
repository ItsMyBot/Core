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

  let author = config.getStringOrNull("author", true);
  let authorIcon = config.getStringOrNull("author-icon", true);
  let authorUrl = config.getStringOrNull("author-url", true);
  let url = config.getStringOrNull("url", true);
  let title = config.getStringOrNull("title", true);
  let description = config.getStringOrNull("description", true);
  const fields = config.getSubsectionsOrNull("fields");
  let footer = config.getStringOrNull("footer", true);
  let footerIcon = config.getStringOrNull("footer-icon", true);
  let thumbnail = config.getStringOrNull("thumbnail", true);
  let image = config.getStringOrNull("image", true);
  let timestamp = config.getStringOrNull("timestamp");
  let color = config.getStringOrNull("color", true) || manager.configs.config.getString("default-color");

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
