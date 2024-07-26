import 'reflect-metadata';

import { GatewayIntentBits, Partials } from 'discord.js';
import { join, resolve } from 'path';
import { readFileSync } from 'fs';
import { Manager } from './manager.js';
import { Logger } from '@utils';
export { Filter } from './services/engine/filters/filter.js';
export { Action } from './services/engine/actions/action.js';
export { Condition } from './services/engine/conditions/condition.js';
export { Mutator } from './services/engine/mutators/mutator.js'
export { Script } from './services/engine/script.js';
export { ActionScript } from './services/engine/actionScript.js';
export { Plugin } from './services/plugins/plugin.js';
export { Expansion } from './services/expansions/expansion.js';
export { User } from './services/users/user.model.js';
export { Event } from './services/events/event.js';
export { Config } from './contracts/config/config.js'
export { Command } from './services/commands/command.js';
export { Leaderboard } from './services/leaderboards/leaderboard.js';
export { CustomCommand } from './services/engine/customCommand.js';
export { Manager };

const logger = new Logger();

const __dirname = resolve();
const packageJsonPath = join(__dirname, 'package.json');
const packageJSON = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

const manager = new Manager(
    {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessageReactions
        ],
        partials: [
            Partials.GuildMember,
            Partials.Message,
            Partials.Channel,
            Partials.User,
        ],
    }, {
    package: packageJSON,
    dir: {
        base: __dirname,
        configs: join(__dirname, 'configs'),
        plugins: join(__dirname, 'build', 'plugins'),
        commands: join(__dirname, 'build', 'core', 'services', 'commands', 'impl'),
        events: join(__dirname, 'build', 'core', 'services', 'events', 'impl'),
        scripts: join(__dirname, 'scripts'),
        customCommands: join(__dirname, 'custom-commands'),
        logs: join(__dirname, 'logs'),
    },
});

manager.initialize();

process.on("uncaughtException", (error, origin) => {
    logger.error(error, error.stack);
});

process.on("unhandledRejection", async (reason: any, promise) => {
    logger.error(reason, reason.stack);
});

export default manager;