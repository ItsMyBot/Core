import { Manager } from '@itsmybot';
import { Logger } from '@utils';
import { join } from 'path';
import { sync } from 'glob';
import { BaseConfig, BaseConfigSection } from '@contracts';
import { Collection } from 'discord.js';
import { existsSync, mkdirSync } from 'fs';

export abstract class Plugin {
  manager: Manager
  logger: Logger

  name: string
  abstract version: string
  abstract authors: string[]
  description?: string
  website?: string
  enabled: boolean = true
  configs?: any
  path: string

  constructor(manager: Manager, name: string) {
    this.manager = manager;
    this.name = this.sanitizeName(name);
    this.logger = new Logger(this.name);
    this.path = join(manager.managerOptions.dir.plugins, name);
  }


  private sanitizeName(name: string): string {
    return name.replace(/[^A-Za-z0-9 _.-]/g, "").replace(/\s+/g, "_");
  }

  async initialize() { }

  async load() {
    try {
      await this.loadDatabaseModels();
      await this.initialize();
      await this.loadComponents();
      this.logger.info(`Plugin loaded in v${this.version}`);
    } catch (error) {
      throw error;
    }
  }

  private async loadComponents() {
    const componentTypes = ['commands', 'buttons', 'selectMenus', 'modals', 'events'];
    for (const type of componentTypes) {
      const dir = join(this.path, type);
      if (sync(`${dir}/*`).length) {
        const componentType = type.slice(0, -1); // remove plural 's' for singular type name

        switch (type) {
          case 'commands':
            await this.manager.services.command.registerFromDir(dir, this);
            break;
          case 'events':
            await this.manager.services.event.registerFromDir(dir, this);
            break;
          case 'buttons':
          case 'selectMenus':
          case 'modals':
            await this.manager.services.component.registerFromDir(dir, componentType, this);
            break;
        }
      }
    }
  }

  private async loadDatabaseModels() {
    for (const model of sync(join(this.path, '/**/*.model.js'))) {
      const { default: Model } = await import(model);

      this.manager.services.database.sequelize.addModels([Model]);
      await Model.sync({ alter: true });
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  async createConfig(configFilePath: string, config?: any, update: boolean = false): Promise<BaseConfig> {
    const pluginFolder = join(this.manager.managerOptions.dir.configs, this.name);
    if (!existsSync(pluginFolder)) mkdirSync(pluginFolder);

    return new BaseConfig({ ConfigClass: config, logger: this.logger, configFilePath: join('configs', this.name, configFilePath), defaultFilePath: join("build", "plugins", this.name, "resources", configFilePath), update: update }).initialize();
  }

  async createConfigSection(config: any, configFolderPath: string): Promise<Collection<string, BaseConfig>> {
    const pluginFolder = join(this.manager.managerOptions.dir.configs, this.name);
    if (!existsSync(pluginFolder)) mkdirSync(pluginFolder);

    return new BaseConfigSection(config, this.logger, join('configs', this.name, configFolderPath), join("build", "plugins", this.name, "resources", configFolderPath)).initialize();
  }
}