import { Collection } from 'discord.js';
import { Config, Manager, Mutator, Plugin } from '@itsmybot';
import { Context, Variable } from '@contracts';

import { MemberMutator } from './impl/member.js';

export class MutatorHandler {
  manager: Manager;
  mutators: Collection<string, Mutator<Plugin | undefined>>;

  constructor(manager: Manager) {
    this.manager = manager;
    this.mutators = new Collection();
  }

  registerMutator(id: string, mutator: Mutator<Plugin | undefined>) {
    if (this.mutators.has(id)) return mutator.logger.warn(`Mutator ${id} is already registered`);

    this.mutators.set(id, mutator);
  }

  async applyMutator(mutatorData: Config, context: Context, variables: Variable[]) {
    const mutator = this.mutators.get(mutatorData.getString("id"));
    if (!mutator) {
      mutatorData.logger.warn(`No mutator found for ID: ${mutatorData.getString("id")}`);
      return context;
    }

    return mutator.apply(mutatorData.getSubsection("args"), context, variables);
  }

  initialize() {
    this.registerMutator("member", new MemberMutator(this.manager));
  }
}