import { join } from 'path';
import { sync } from 'glob';
import { Manager, Event, Plugin } from '@itsmybot';
import { Collection } from 'discord.js';
import { Service } from '@contracts';

export default class EventService extends Service {
  eventsDir: string;
  events: Collection<string, EventExecutor>;

  constructor(manager: Manager) {
    super(manager);
    this.eventsDir = manager.managerOptions.dir.coreEvents;
    this.events = manager.events;
  }

  async initialize() {
    this.manager.logger.info("Event service initialized.");
    await this.registerFromDir(this.eventsDir);
  }

  async registerFromDir(eventsDir: string, plugin: Plugin | undefined = undefined) {
    const eventFiles = sync(join(eventsDir, '**', '*.js'));

    for (const filePath of eventFiles) {
      const eventPath = new URL('file://' + filePath.replace(/\\/g, '/')).href;
      const { default: event } = await import(eventPath);

      await this.registerEvent(new event(this.manager, plugin));
    };
  }

  async registerEvent(event: Event<Plugin | undefined>) {
    try {
      if (!this.events.has(event.name)) {
        this.events.set(event.name, new EventExecutor(event.once || false));
      }
      this.events.get(event.name)?.addEvent(event);
    } catch (e: any) {
      event.logger.error(`Error initializing event '${Event.name}'`, e.stack);
    }
  }

  initializeEvents() {
    for (const [name, executor] of this.events) {
      if (executor.once) {
        this.manager.client.once(name, (...args) => {
          executor.run(...args);
        });
      } else {
        this.manager.client.on(name, (...args) => {
          executor.run(...args);
        });
      }
    }
  }
}

export class EventExecutor {
  events: Event<Plugin | undefined>[] = [];
  once;

  constructor(once: boolean = false) {
    this.once = once;
  }

  addEvent(event: Event<Plugin | undefined>) {
    this.events.push(event);
    this.events.sort((a, b) => a.priority - b.priority);
  }

  async run(...args: any[]) {
    let i = 0;

    while (i < this.events.length) {
      const event = this.events[i];
      try {
        await event.execute(...args);
      } catch (e: any) {
        if (e === 'stop') break;
        event.logger.error('Error executing event', e.stack);
      }
      i++;
    }
  }
}