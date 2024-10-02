import { Client, Collection } from 'discord.js';
import { existsSync, mkdirSync } from 'fs';
import { Logger } from '@utils';
import { Command, Component, Expansion, Leaderboard, Plugin } from '@itsmybot'
import { ClientOptions, ManagerOptions, Services, ManagerConfigs, BaseConfig, Service } from '@contracts';
import { Sequelize } from 'sequelize-typescript';

import EventService, { EventExecutor } from './services/events/eventService.js';
import UserService from './services/users/userService.js';
import CommandService from './services/commands/commandService.js';
import EngineService from './services/engine/engineService.js';
import PluginService from './services/plugins/pluginService.js';
import ExpansionService from './services/expansions/expansionService.js';
import ComponentService from './services/components/componentService.js';
import LeaderboardService from './services/leaderboards/leaderboardService.js';
import DefaultConfig from 'core/resources/config.js';
import CommandConfig from 'core/resources/commands.js';
import LangConfig from 'core/resources/lang.js';

export class Manager {
  public client: Client<true>;
  public services: Services = {} as Services;
  public configs: ManagerConfigs = {} as ManagerConfigs;
  public database: Sequelize;

  public managerOptions: ManagerOptions;
  public commands = new Collection<string, Command>();
  public events = new Collection<string, EventExecutor>();
  public plugins = new Collection<string, Plugin>();
  public expansions = new Collection<string, Expansion>();
  public leaderboards = new Collection<string, Leaderboard>();
  public components = {
    buttons: new Collection<string, Component>(),
    selectMenus: new Collection<string, Component>(),
    modals: new Collection<string, Component>()
  }
  public logger = new Logger();
  public primaryGuildId: string;

  constructor(clientOptions: ClientOptions, managerOptions: ManagerOptions) {
    this.client = new Client(clientOptions);
    this.managerOptions = managerOptions;

    if (!existsSync(managerOptions.dir.configs)) mkdirSync(managerOptions.dir.configs);
    if (!existsSync(managerOptions.dir.plugins)) mkdirSync(managerOptions.dir.plugins);
    if (!existsSync(managerOptions.dir.logs)) mkdirSync(managerOptions.dir.logs);
  }

  public async initialize(): Promise<void> {
    this.configs.config = await this.initializeConfig(DefaultConfig, 'config.yml');
    this.configs.commands = await this.initializeConfig(CommandConfig, 'commands.yml');
    this.configs.lang = await this.initializeConfig(LangConfig, 'lang.yml');

    this.primaryGuildId = this.configs.config.getString("primary-guild");

    await this.initializeDatabase();

    this.services.engine = await this.createService(EngineService);
    this.services.expansion = await this.createService(ExpansionService);
    this.services.user = await this.createService(UserService);
    this.services.event = await this.createService(EventService);
    this.services.command = await this.createService(CommandService);
    this.services.component = await this.createService(ComponentService);
    this.services.leaderboard = await this.createService(LeaderboardService);
    this.services.plugin = await this.createService(PluginService);

    await this.services.engine.loadCustomCommands();
    this.services.leaderboard.registerLeaderboards();
    this.services.event.initializeEvents();

    this.client.login(this.configs.config.getString("token"));
  }

  private async initializeConfig(ConfigClass: any, filePath: string) {
    return await new BaseConfig({
      logger: this.logger,
      configFilePath: `configs/${filePath}`,
      defaultFilePath: `build/core/resources/${filePath}`,
      ConfigClass
    }).initialize();
  }

  private async initializeDatabase() {
    this.logger.info('Initializing database...');
    const databaseConfig = this.configs.config.getSubsection('database');

    if (['mysql', 'mariadb'].includes(databaseConfig.getString('type'))) {
      this.database = new Sequelize(
        databaseConfig.getString('database'),
        databaseConfig.getString('username'),
        databaseConfig.getString('password'),
        {
          host: databaseConfig.getString('host'),
          dialect: databaseConfig.getString('type') as 'mysql' | 'mariadb',
          logging: databaseConfig.getBoolOrNull('debug') || false
        });
    } else {
        this.database = new Sequelize({
          dialect: 'sqlite',
          storage: 'database.sqlite',
          logging: databaseConfig.getBoolOrNull('debug') || false
        });
    }

    try {
      await this.database.authenticate();
      this.logger.info('Connection has been established successfully with database.');
    } catch (error) {
      this.logger.error('Unable to connect to the database:', error);
      process.exit(1);
    }
  }

  private async createService<T extends Service>(ServiceType: new (manager: Manager) => T): Promise<T> {
    const service = new ServiceType(this);
    await service.initialize();
    return service;
  }
}