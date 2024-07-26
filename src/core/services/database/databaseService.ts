import { Sequelize } from 'sequelize-typescript';
import { Config, Manager } from '@itsmybot';

export default class DatabaseService {
  manager: Manager;
  config: Config;
  sequelize: Sequelize;

  constructor(manager: Manager) {
    this.manager = manager;
    this.config = manager.configs.config.getSubsection('database');
    this.sequelize = this.initializeSequelize();
  }

  private initializeSequelize() {
    switch (this.config.getString('type')) {
      case 'mysql':
      case 'mariadb':
        return new Sequelize(this.config.getString('database'), this.config.getString('username'), this.config.getString('password'), {
          host: this.config.getString('host'),
          dialect: this.config.getString('type') as 'mysql' | 'mariadb',
          logging: this.config.getBoolOrNull('debug') || false
        });
      default:
        return new Sequelize({
          dialect: 'sqlite',
          storage: 'database.sqlite',
          logging: this.config.getBoolOrNull('debug') || false
        });
    }
  }

  async initialize() {
    this.manager.logger.info('Initializing database...');
    try {
      await this.sequelize.authenticate();

      this.manager.logger.info('Connection has been established successfully with database.');
    } catch (error) {
      this.sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: 'database.sqlite',
        logging: this.config.getBoolOrNull('debug') || false
      });
      this.manager.logger.error('Unable to connect to the database:', error);
    }
  }
}