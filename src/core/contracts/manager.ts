import { GatewayIntentBits, Partials } from 'discord.js'
import CommandService from 'core/services/commands/commandService'
import ComponentService from 'core/services/components/componentService'
import DatabaseService from 'core/services/database/databaseService'
import EngineService from 'core/services/engine/engineService'
import EventService from 'core/services/events/eventService'
import ExpansionService from 'core/services/expansions/expansionService'
import PluginService from 'core/services/plugins/pluginService'
import UserService from 'core/services/users/userService'
import LeaderboardService from 'core/services/leaderboards/leaderboardService'
import { BaseConfig } from './config/baseConfig'

export interface ClientOptions {
  intents: GatewayIntentBits[],
  partials: Partials[]
}

export interface ManagerOptions {
  package: any,
  dir: {
    base: string,
    configs: string,
    plugins: string,
    commands: string,
    events: string,
    scripts: string,
    customCommands: string,
    logs: string
  }
}

export interface Services {
  event: EventService,
  user: UserService,
  command: CommandService,
  engine: EngineService,
  plugin: PluginService,
  database: DatabaseService,
  expansion: ExpansionService,
  component: ComponentService,
  leaderboard: LeaderboardService
}

export interface ManagerConfigs {
  config: BaseConfig,
  lang: BaseConfig,
  commands: BaseConfig
}