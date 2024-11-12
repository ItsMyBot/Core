import { ChatInputCommandInteraction } from 'discord.js';
import { Manager, Plugin } from '@itsmybot';
import { Logger } from '@utils';
import { APIActionRowComponent, APIEmbed, APIMessageActionRowComponent, Attachment, AttachmentBuilder, BufferResolvable, MessageMentionOptions, PollData } from 'discord.js';
import { Stream } from 'stream';

export { Context } from './context.js';
export { Events, EventType } from './events.js';
export { ClientOptions, ManagerOptions, Services, ManagerConfigs } from './manager.js';

export { IsPermissionFlag, IsActivityType, IsTextInputStyle, IsStringOrStrings, IsChannelType, IsCommandOptionType } from './decorators/validator.js';

export { BaseConfig } from './config/baseConfig.js';
export { BaseConfigSection } from './config/baseConfigSection.js';
import { Config } from './config/config.js';
export { CommandValidator } from './validators/command.js';
export { MessageValidator } from './validators/message.js';
export { ButtonValidator, ComponentValidator, ModalValidator } from './validators/component.js';

export { Config };

export interface Variable {
  searchFor: string;
  replaceWith: string | number | undefined | null | boolean;
}

export enum PaginationType {
  SelectMenu = "select_menu",
  Button = "button"
}

export type LogConfigOptions = "minor" | "moderate" | "high" | "major" | "critical";

export interface MessageOutput {
  allowedMentions: MessageMentionOptions,
  components: APIActionRowComponent<APIMessageActionRowComponent>[],
  content: string | undefined,
  embeds: APIEmbed[],
  ephemeral?: boolean,
  fetchReply?: boolean,
  files: (Attachment | AttachmentBuilder | Stream | BufferResolvable)[],
  poll?: PollData
}


export type CommandInteraction = ChatInputCommandInteraction<'cached'>;

export class Base<T extends Plugin | undefined = undefined> {
  public manager: Manager;
  public plugin: T;
  public logger: Logger;

  constructor(manager: Manager, plugin?: T) {
    this.manager = manager;
    this.plugin = plugin as T;
    this.logger = plugin ? plugin.logger : manager.logger;
  }
}

export abstract class Service {
  protected manager: Manager

  constructor(manager: Manager) {
    this.manager = manager
  }

  abstract initialize(): Promise<void>
}