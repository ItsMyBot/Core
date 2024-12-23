import { Collection } from 'discord.js';
import { Action, ActionData, Manager, Plugin } from '@itsmybot';
import { Context, Variable } from '@contracts';
import { sync } from 'glob';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export class ActionHandler {
  manager: Manager;
  actions: Collection<string, Action<Plugin | undefined>>;

  constructor(manager: Manager) {
    this.manager = manager;
    this.actions = new Collection();
  }

  async initialize() {
    await this.registerFromDir(join(dirname(fileURLToPath(import.meta.url)), 'impl'))
  }

  async registerFromDir(actionsDir: string, plugin: Plugin | undefined = undefined) {
    const actionFiles = sync(join(actionsDir, '**', '*.js').replace(/\\/g, '/'));

    for (const filePath of actionFiles) {
      const actionPath = new URL('file://' + filePath.replace(/\\/g, '/')).href;
      const { default: action } = await import(actionPath);

      this.registerAction(new action(this.manager, plugin));
    };
  }

  registerAction(action: Action<Plugin | undefined>) {
    if (this.actions.has(action.id)) return action.logger.warn(`Action ${action.id} is already registered`);

    this.actions.set(action.id, action);
  }

  async triggerAction(script: ActionData, context: Context, variables: Variable[] = []) {
    if (!script.id) return script.logger.error("No action ID found in script");

    const actionInstance = this.actions.get(script.id);
    if (!actionInstance) return script.logger.warn(`No action found for ID: ${script.id}`);

    actionInstance.trigger(script, context, variables);
  }
}