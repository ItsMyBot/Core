
import { join } from 'path';
import { sync } from 'glob';

import { Manager, Plugin } from '@itsmybot';
import { Collection } from 'discord.js';
import { Logger } from '@utils';
import { PluginModel } from './plugin.model.js';

export default class PluginService {
  manager: Manager;
  pluginsDir: string;
  plugins: Collection<string, Plugin>;

  constructor(manager: Manager) {
    this.manager = manager;
    this.pluginsDir = manager.managerOptions.dir.plugins;
    this.plugins = manager.plugins;

    this.manager.services.database.sequelize.addModels([PluginModel]);

  }

  async initialize() {
    this.manager.logger.info("Initializing plugins...");

    await PluginModel.sync({ alter: true });

    const pluginFolders = sync("*/", { cwd: this.pluginsDir, dot: false });
    for (const pluginFolder of pluginFolders) {
      const logger = new Logger(pluginFolder);
      try {
        await this.loadPlugin(pluginFolder);
      } catch (error: any) {
        logger.error("Error loading:", error.stack);
      }
    }

    this.manager.logger.info("Plugin service initialized.");
  }

  async loadPlugin(name: string) {
    const pluginClassPath = join(this.pluginsDir, name, 'index.js');
    if (!sync(pluginClassPath).length) {
      throw new Error(`Plugin ${name} is missing the index.js file.`);
    }

    const pluginClass = new URL('file://' + pluginClassPath.replace(/\\/g, '/')).href;
    const { default: Plugin } = await import(pluginClass);
    const plugin = new Plugin(this.manager, name);

    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} already exists.`);
    }

    const [pluginData] = await PluginModel.findOrCreate({ where: { name: plugin.name } });
    if (!pluginData.enabled) {
      plugin.setEnabled(false);
    } else {
      await plugin.load();
    }

    this.plugins.set(plugin.name, plugin);
  }
}