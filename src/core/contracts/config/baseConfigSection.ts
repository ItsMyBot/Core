import { Logger } from '@utils';
import Utils from '@utils';
import * as fs from 'fs/promises';
import { join, resolve } from 'path';
import { glob } from 'glob';
import { Collection } from 'discord.js';
import { BaseConfig } from './baseConfig.js';

export class BaseConfigSection {
  public configClass: any

  public logger: Logger
  public configs: Collection<string, BaseConfig> = new Collection();

  private configFolderPath: string;
  private relConfigFolderPath: string;
  private relDefaultFolderPath: string;

  constructor(ConfigClass: any, logger: Logger, configFolderPath: string, defaultFolderPath: string) {
    this.configClass = ConfigClass
    this.logger = logger

    this.configFolderPath = configFolderPath;
    this.relConfigFolderPath = join(resolve(), configFolderPath);
    this.relDefaultFolderPath = join(resolve(), defaultFolderPath);
  }

  async initialize() {
    if (!await Utils.fileExists(this.relDefaultFolderPath)) {
      this.logger.error(`Default file not found at ${this.relDefaultFolderPath}`);
      return this.configs;
    }

    if (!await Utils.fileExists(this.relConfigFolderPath)) {
      this.logger.warn(`Config folder not found at ${this.relConfigFolderPath}, creating one`);
      await fs.mkdir(this.relConfigFolderPath, { recursive: true });

      const files = await glob('**/*.yml', { cwd: this.relDefaultFolderPath, dot: true });

      for (const item of files) {
        const destPath = join(this.relConfigFolderPath, item);
        const srcPath = join(this.relDefaultFolderPath, item);

        const stats = await fs.stat(srcPath);
        if (stats.isDirectory()) {
          await fs.mkdir(destPath, { recursive: true });
        } else {
          await fs.copyFile(srcPath, destPath);
        }
      }
    }

    await this.loadConfigs();

    return this.configs;
  }

  async loadConfigs() {
    const files = await glob('**/!(_)*.yml', { cwd: this.relConfigFolderPath, dot: true });

    for (const file of files) {
      const destPath = join(this.configFolderPath, file);
      const id = file.slice(0, -4); // remove .yml extension

      const config = new BaseConfig({ ConfigClass: this.configClass, logger: this.logger, configFilePath: destPath });
      await config.initialize();
      this.configs.set(id, config);
    }
  }
}