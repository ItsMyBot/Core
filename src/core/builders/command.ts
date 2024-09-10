import { ContextMenuCommandBuilder, SlashCommandBuilder } from 'discord.js';
import { ComponentBuilder } from '@builders';
import Utils from '@utils';
import { Config } from '@itsmybot';

export class CommandBuilder extends SlashCommandBuilder {
  component: ComponentBuilder;
  aliases: string[];
  enabled: boolean;

  constructor() {
    super();

    this.component = new ComponentBuilder();

    this.aliases = [];
    this.enabled = true;
  }

  public setConfig(config: Config) {
    this.component.setConfig(config);
    Object.assign(this, this.component);

    this.setDescription(config.getString("description"));
    if (config.has("permission")) {
      this.setDefaultMemberPermissions(Utils.permissionFlags(config.getString("permission")));
    }
    if (config.has("aliases")) this.setAliases(config.getStrings("aliases"));
    if (config.getBoolOrNull("enabled") === false) this.setEnabled(false);

    return this;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    return this;
  }

  public setAliases(aliases: string[]) {
    this.aliases = aliases;
    return this;
  }

  public setPublic() {
    this.component.setPublic();
    return this;
  }
}

export class ContextMenuBuilder extends ContextMenuCommandBuilder {
  component: ComponentBuilder;
  enabled: boolean;

  constructor() {
    super();

    this.component = new ComponentBuilder();
    this.enabled = true;
  }

  public setConfig(config: Config) {
    this.component.setConfig(config);
    Object.assign(this, this.component);

    if (config.has("permission")) {
      this.setDefaultMemberPermissions(Utils.permissionFlags(config.getString("permission")));
    }
    if (config.getBoolOrNull("enabled") === false) this.setEnabled(false);

    return this;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    return this;
  }

  public setPublic() {
    this.component.setPublic();
    return this;
  }
}
