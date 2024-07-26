import { Events as DiscordEvents } from 'discord.js';

enum BotEvents {
  EveryHour = 'everyHour',
  EveryMinute = 'everyMinute',
  BotReady = 'botReady',
  Button = 'button',
  SelectMenu = 'selectMenu',
  ModalSubmit = 'modalSubmit',
}

const Events = {
  ...BotEvents,
  ...DiscordEvents
}

type EventType = keyof typeof Events;

export { Events, EventType }

