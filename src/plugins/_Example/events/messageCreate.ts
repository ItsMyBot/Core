import { Events, Message } from 'discord.js';
import { Event } from '@itsmybot';
import ExamplePlugin from '..';

export default class MessageCreateEvent extends Event<ExamplePlugin> {
  name = Events.MessageCreate; // This is the event name
  priority = 3; // This is the priority of the event, the lower the number, the higher the priority (default is 3)

  async execute(message: Message) {
    this.logger.debug('MessageCreateEvent', message.content);

    //this.cancelEvent(); // This will stop the event from executing other events with a lower priority
  }
};