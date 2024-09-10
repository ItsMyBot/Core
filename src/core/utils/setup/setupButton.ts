import { ButtonBuilder, ButtonStyle } from 'discord.js';
import Utils from '@utils';
import { Config } from '@itsmybot';
import { Context, Variable } from '@contracts';

interface ButtonSettings {
  config: Config,
  variables?: Variable[],
  context: Context,
  customId?: string,
  disabled?: boolean,
  label?: string,
  emoji?: string,
  style?: string,
  url?: string
}

/**
 * Setup a button with the given settings
 */
export async function setupButton(settings: ButtonSettings) {
  const variables = settings.variables || []
  const context = settings.context;
  const config = settings.config;

  let style = settings.style || config.getStringOrNull("style") || config.getStringsOrNull("style");
  let customId = settings.customId || config.getStringOrNull("custom-id") || config.getStringsOrNull("custom-id");
  let disabled = settings.disabled || config.getBoolOrNull("disabled") || false;
  let label = settings.config.getStringOrNull("label") || config.getStringsOrNull("label");
  let emoji = settings.config.getStringOrNull("emoji") || config.getStringsOrNull("emoji");
  let url = settings.url || settings.config.getStringOrNull("url") || config.getStringsOrNull("url");

  if (Array.isArray(style)) style = Utils.getRandom(style);
  if (Array.isArray(customId)) customId = Utils.getRandom(customId);
  if (Array.isArray(label)) label = Utils.getRandom(label);
  if (Array.isArray(emoji)) emoji = Utils.getRandom(emoji);
  if (Array.isArray(url)) url = Utils.getRandom(url);

  style = await Utils.applyVariables(style, variables, context);
  customId = await Utils.applyVariables(customId, variables, context);
  label = await Utils.applyVariables(label, variables, context);
  emoji = await Utils.applyVariables(emoji, variables, context);
  url = await Utils.applyVariables(url, variables, context);

  const button = new ButtonBuilder()
    .setDisabled(disabled);

  if (url) {
    if (!Utils.isValidURL(url)) {
      button.setStyle(ButtonStyle.Danger);
      button.setLabel("Invalid URL");
      button.setDisabled(true);

      return button;
    }

    button.setStyle(ButtonStyle.Link);
    button.setURL(url);
  } else {
    button.setStyle(Utils.buttonStyle(style) || ButtonStyle.Primary);
    button.setCustomId(customId);
  }

  if (label) button.setLabel(label);
  if (emoji) button.setEmoji(emoji);

  return button;
}
