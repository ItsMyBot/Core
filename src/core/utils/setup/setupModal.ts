import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import Utils from '@utils';
import { Config } from '@itsmybot';
import { Context, Variable } from '@contracts';

interface ModalSettings {
  config: Config,
  variables?: Variable[],
  context: Context,
  customId?: string,
  title?: string
}

export async function setupModal(settings: ModalSettings) {
  const variables = settings.variables || []
  const context = settings.context;

  let customId = settings.customId || settings.config.getString("custom-id");
  let title = settings.title || settings.config.getString("title", true)

  customId = await Utils.applyVariables(customId, variables, context);
  if (!customId) throw new Error(`Custom ID is required for a modal.`);

  title = await Utils.applyVariables(title, variables, context);

  const modal = new ModalBuilder()
    .setCustomId(customId)
    .setTitle(title);

  const components: Config[] = settings.config.getSubsections("components");
  for (const component of components) {

    let cCustomId = component.getString("id");
    let cLabel = component.getString("label", true);
    let cPlaceholder = component.getStringOrNull("placeholder", true) || '';
    const cRequired = component.getBoolOrNull("required") || false;
    let cMaxLength = component.getStringOrNull("max-length") || "1000";
    let cValue = component.getStringOrNull("value", true) || '';
    const cStyle = component.getStringOrNull("style");

    cCustomId = await Utils.applyVariables(cCustomId, variables, context);
    cLabel = await Utils.applyVariables(cLabel, variables, context);
    cPlaceholder = await Utils.applyVariables(cPlaceholder, variables, context);
    cMaxLength = await Utils.applyVariables(cMaxLength, variables, context);
    cValue = await Utils.applyVariables(cValue, variables, context);

    const row = new ActionRowBuilder<TextInputBuilder>()
      .addComponents(
        new TextInputBuilder()
          .setCustomId(cCustomId)
          .setLabel(cLabel)
          .setPlaceholder(cPlaceholder || "")
          .setRequired(cRequired)
          .setMaxLength(parseInt(cMaxLength) || 1000)
          .setValue(cValue || "")
          .setStyle((cStyle ? Utils.textInputStyle(cStyle) || TextInputStyle.Short : TextInputStyle.Short))
      );
    modal.addComponents(row);
  }

  return modal;
}
