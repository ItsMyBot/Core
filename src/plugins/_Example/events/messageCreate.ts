import { Events, Message } from 'discord.js';
import { Event } from '@itsmybot';
import ExamplePlugin from '..';

export default class MessageCreateEvent extends Event<ExamplePlugin> {
  name = Events.MessageCreate;
  priority = 0;

  async execute(message: Message) {
    this.logger.debug('MessageCreateEvent', message.content);
  }
};