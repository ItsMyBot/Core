import { Plugin } from '@itsmybot';

import PluginConfig from './resources/config.js'; // Import configuration validators
import LangConfig from './resources/lang.js';
import CommandsConfig from './resources/commands.js';
import CategoryConfig from './resources/category.js';

// This is an example plugin, you can use this as a template for your own plugins, since it's start with an underscore, it won't be loaded.
export default class ExamplePlugin extends Plugin {
  version = '0.0.1'; // Version of the plugin, required
  authors = ['@itsme.to'] // Authors of the plugin, required
  website = 'https://yourwebsite.com'; // Website of the plugin, optional, can be used for more information or purchase

  async load() {
    // This method is called when the plugin is loaded, before initialize and can be reloadable, useful for loading configs

    // This is an example of how to load configs
    // This will load the each file and validate it with the configuration validators
    // The first parameter is the file path, used to save the config and to load the default config inside the resources folder
    // The second parameter is the configuration validator, used to validate the config file
    this.configs.config = await this.createConfig('config.yml', PluginConfig); 
    this.configs.lang = await this.createConfig('lang.yml', LangConfig);
    this.configs.commands = await this.createConfig('commands.yml', CommandsConfig);

    // This is an example of how to load a folder of configs, this will load all the files inside the folder and validate them with the configuration validator. Useful for like tickets categories, etc. Supports subfolders.
    this.configs.categories = await this.createConfigSection('categories', CategoryConfig);
  }

  async initialize() {
    // This method is called when the plugin is initialized, only called once, useful for registering Expansions, etc.
  }
}