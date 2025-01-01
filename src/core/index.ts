import 'reflect-metadata';

import { GatewayIntentBits, Partials } from 'discord.js';
import { join } from 'path';
import { readFileSync } from 'fs';
import { Manager } from './manager.js';
import { Logger } from '@utils';

export { Action } from './services/actions/action.js';
export { ConditionData } from './services/conditions/conditionData.js';
export { Condition } from './services/conditions/condition.js';
export { BaseScript } from './services/engine/baseScript.js';
export { Script } from './services/engine/script.js';
export { ActionData } from './services/actions/actionData.js';
export { Plugin } from './services/plugins/plugin.js';
export { Expansion } from './services/expansions/expansion.js';
export { User } from './services/users/user.model.js';
export { Event } from './services/events/event.js';
export { Config } from './contracts/config/config.js'
export { Command } from './services/commands/command.js';
export { Component } from './services/components/component.js';
export { Leaderboard } from './services/leaderboards/leaderboard.js';
export { CustomCommand } from './services/engine/customCommand.js';
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