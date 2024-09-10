import Utils from '@utils';
import { StringSelectMenuBuilder } from 'discord.js';
import { Config } from '@itsmybot';
import { Context, Variable } from '@contracts';

interface ComponentSettings {
  config: Config,
  variables?: Variable[],
  context: Context,
}

export async function setupComponent(settings: ComponentSettings) {
  const component = settings.config;
  const variables = settings.variables || [];
  const context = settings.context;

  const type = component.getStringOrNull("type") || "button";
  const customId = component.getStringOrNull("custom-id");
  const disabled = component.getBoolOrNull("disabled") || false;

  switch (type) {
    case "button": {
      return Utils.setupButton({ config: component, variables, context });
    }

    case "select-menu": {
      let placeholder = component.getStringOrNull("placeholder");
      let minSelect = component.getNumberOrNull("min-values") || 0;
      let maxSelect = component.getNumberOrNull("max-values") || 1;
      let options = component.getSubsectionsOrNull("options");

      if (customId) {
        const selectMenu = new StringSelectMenuBuilder()
          .setCustomId(customId)
          .setDisabled(disabled)
          .setMaxValues(maxSelect)
          .setMinValues(minSelect)

        const placeholderValue = await Utils.applyVariables(placeholder, variables, context);
        if (placeholderValue) selectMenu.setPlaceholder(placeholderValue);

        if (options && options[0]) {
          for (const option of options) {
            let label = option.getStringOrNull("label");
            let value = option.getStringOrNull("value");
            let emoji = option.getStringOrNull("emoji");
            let defaultOption = option.getBoolOrNull("default") || false;
            let description = option.getStringOrNull("description");

            let data = {
              label: label ?? await Utils.applyVariables(label, variables, context),
              value: value ?? await Utils.applyVariables(value, variables, context),
              emoji: emoji ? await Utils.applyVariables(emoji, variables, context) : undefined,
              description: description ? await Utils.applyVariables(description, variables, context) : undefined,
              default: defaultOption
            };

            selectMenu.addOptions(data);
          }
        }

        return selectMenu;
      }
    }
  }
}