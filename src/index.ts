import 'reflect-metadata';

import { GatewayIntentBits, Partials } from 'discord.js';
import { join } from 'path';
import { readFileSync } from 'fs';
import { Manager } from './core/manager.js';
import { Logger } from '@utils';

export { Action } from './core/services/actions/action.js';
export { ConditionData } from './core/services/conditions/conditionData.js';
export { Condition } from './core/services/conditions/condition.js';
export { BaseScript } from './core/services/engine/baseScript.js';
export { Script } from './core/services/engine/script.js';
export { ActionData } from './core/services/actions/actionData.js';
export { Plugin } from './core/services/plugins/plugin.js';
export { Expansion } from './core/services/expansions/expansion.js';
export { User } from './core/services/users/user.model.js';
export { Event } from './core/services/events/event.js';
export { Config } from './core/contracts/config/config.js'
export { Command } from './core/services/commands/command.js';
export { Component } from './core/services/components/component.js';
export { Leaderboard } from './core/services/leaderboards/leaderboard.js';
export { CustomCommand } from './core/services/engine/customCommand.js';
export { Manager };

const logger = new Logger();

const processFolder = process.cwd();

const packageJsonPath = join(processFolder, 'package.json');
const packageJSON = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

const manager = new Manager({
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
        base: processFolder,
        configs: join(processFolder, 'configs'),
        plugins: join(processFolder, 'build', 'plugins'),
        scripts: join(processFolder, 'scripts'),
        customCommands: join(processFolder, 'custom-commands'),
        logs: join(processFolder, 'logs'),
    }
});

manager.initialize();

process.on("uncaughtException", (error, origin) => {
    logger.error(error, error.stack);
});

process.on("unhandledRejection", async (reason: any, promise) => {
    logger.error(reason, reason?.stack ? reason.stack : "No stack trace");
});

export default manager;