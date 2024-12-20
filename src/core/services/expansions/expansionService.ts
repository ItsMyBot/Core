import { Collection } from 'discord.js';
import { MathExpansion } from './impl/math.js';
import { OwnerExpansion } from './impl/owner.js';
import { PerformanceExpansion } from './impl/performance.js';
import { BotExpansion } from './impl/bot.js';
import { GuildExpansion } from './impl/guild.js';
import { Manager, Expansion, Plugin } from '@itsmybot';
import { Context, Service } from '@contracts';

export default class ExpansionService extends Service{
  expansions: Collection<string, Expansion<Plugin | undefined>>;

  constructor(manager: Manager) {
    super(manager);
    this.expansions = manager.expansions;
  }

  async initialize() {
    this.manager.logger.info("Placeholder expansions services initialized.");
    this.registerExpansion("math", new MathExpansion(this.manager));
    this.registerExpansion("owner", new OwnerExpansion(this.manager));
    this.registerExpansion("performance", new PerformanceExpansion(this.manager));
    this.registerExpansion("bot", new BotExpansion(this.manager));
    this.registerExpansion("guild", new GuildExpansion(this.manager));
  }

  registerExpansion(identifier: string, expansion: Expansion<Plugin | undefined>) {
    if (this.expansions.has(identifier)) {
      return this.manager.logger.error(`An expansion with the identifier ${identifier} is already registered.`);
    }
    this.expansions.set(identifier, expansion);
  }

  unregisterExpansion(identifier: string) {
    this.expansions.delete(identifier);
  }

  async resolvePlaceholders(text: string, context: Context = {}) {
    const matches = [...text.matchAll(/%([^%_]+)_(.*?)%/g)];

    for (const match of matches) {
      const [fullMatch, identifier, placeholder] = match;

      const expansion = this.expansions.get(identifier);
      if (expansion) {
        const resolvedPlaceholder = await this.resolveNestedPlaceholders(placeholder, context);
        const replacement = await expansion.onRequest(context, resolvedPlaceholder);
        if (replacement === null || replacement === undefined) return text
        text = text.replace(fullMatch, replacement);
      }
    }

    return text;
  }

  async resolveNestedPlaceholders(placeholder: string, context: Context) {
    const nestedMatches = [...placeholder.matchAll(/\{(.*?)_(.*?)\}/g)];

    for (const nestedMatch of nestedMatches) {
      const [fullNestedMatch, nestedIdentifier, nestedPlaceholder] = nestedMatch;

      const nestedExpansion = this.expansions.get(nestedIdentifier);
      if (nestedExpansion) {
        const nestedReplacement = await nestedExpansion.onRequest(context, nestedPlaceholder);
        if (!nestedReplacement) return placeholder
        return placeholder.replace(fullNestedMatch, nestedReplacement);
      }
    }

    return placeholder;
  }
}