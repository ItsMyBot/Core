import { Collection } from 'discord.js';
import { Config, Manager, Mutator, Plugin } from '@itsmybot';
import { Context, Variable, Service } from '@contracts';
import { sync } from 'glob';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

/**
 * Service to manage mutators in the bot.
 * Mutators are used to edit the base context used in the scripting system in the engine.
 */
export default class MutatorService extends Service {
  mutators: Collection<string, Mutator<Plugin | undefined>>;

  constructor(manager: Manager) {
    super(manager);
    this.mutators = new Collection();
  }

  async initialize() {
    await this.registerFromDir(join(dirname(fileURLToPath(import.meta.url)), 'impl'))
    this.manager.logger.info("Mutator service initialized.");
  }

  async registerFromDir(mutatorsDir: string, plugin: Plugin | undefined = undefined) {
    const mutatorFiles = sync(join(mutatorsDir, '**', '*.js').replace(/\\/g, '/'));

    for (const filePath of mutatorFiles) {
      const mutatorPath = new URL('file://' + filePath.replace(/\\/g, '/')).href;
      const { default: mutator } = await import(mutatorPath);

      this.registerMutator(new mutator(this.manager, plugin));
    };
  }

  registerMutator(mutator: Mutator<Plugin | undefined>) {
    if (this.mutators.has(mutator.id)) return mutator.logger.warn(`Mutator ${mutator.id} is already registered`);

    this.mutators.set(mutator.id, mutator);
  }

  async applyMutator(mutatorData: Config, context: Context, variables: Variable[]) {
    const mutator = this.mutators.get(mutatorData.getString("id"));
    if (!mutator) {
      mutatorData.logger.warn(`No mutator found for ID: ${mutatorData.getString("id")}`);
      return context;
    }

    return mutator.apply(mutatorData.getSubsection("args"), context, variables);
  }
}