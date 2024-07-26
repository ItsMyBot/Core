import { Collection } from 'discord.js';
import { ActionScript, Config, Manager, Filter } from '@itsmybot';
import { Context } from '@contracts';

import { IsBotFilter } from './impl/isBot.js';
import { NotContentFilter } from './impl/notContent.js';
import { NotContentContainsFilter } from './impl/notContentContains.js';
import { ContentFilter } from './impl/content.js';
import { ContentContainsFilter } from './impl/contentContains.js';

export class FilterHandler {
  manager: Manager;
  filters: Collection<string, Filter>;

  constructor(manager: Manager) {
    this.manager = manager;

    this.filters = new Collection();
  }

  registerFilter(id: string, filter: Filter) {
    if (this.filters.has(id)) return filter.logger.warn(`Filter ${id} is already registered`);

    this.filters.set(id, filter);
  }

  async isFilterMet(name: string, script: ActionScript, context: Context, args: Config) {
    const filter = this.filters.get(name);
    if (!filter) {
      this.manager.logger.warn(`No filter found for ID: ${name}`);
      return false;
    }

    const filterParameters = filter.parameters().filter(param => !(param in context));
    for (const param of filterParameters) {
      this.manager.logger.error(`The filter ${name} don't have enought information, missing '${param}'`);
      return false;
    }

    return filter.isMet(script, context, args);
  }

  initialize() {
    this.registerFilter("isBot", new IsBotFilter(this.manager));
    this.registerFilter("notContent", new NotContentFilter(this.manager));
    this.registerFilter("notContentContains", new NotContentContainsFilter(this.manager));
    this.registerFilter("content", new ContentFilter(this.manager));
    this.registerFilter("contentContains", new ContentContainsFilter(this.manager));
  }
}