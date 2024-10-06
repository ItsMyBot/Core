import chalk from 'chalk';
import { schedule } from 'node-cron';
import { Event } from '@itsmybot';
import { Events } from '@contracts';
import { Client } from 'discord.js';

export default class ClientReadyEvent extends Event {
  name = Events.ClientReady;
  once = true;

  async execute(client: Client) {
    this.manager.services.command.deployCommands();

    this.manager.logger.info(`Engine Actions registered: ${this.manager.services.engine.action.actions.size}`);
    this.manager.logger.info(`Engine Conditions registered: ${this.manager.services.engine.condition.conditions.size}`);
    this.manager.logger.info(`Engine Mutators registered: ${this.manager.services.engine.mutator.mutators.size}`);
    this.manager.logger.info(`Commands registered: ${this.manager.commands.size}`);
    this.manager.logger.info(`Events registered: ${this.manager.events.size}`);
    this.manager.logger.info(`Plugins registered: ${this.manager.plugins.size}`);
    this.manager.logger.info(`Placeholder Expansions registered: ${this.manager.expansions.size}`);

    this.manager.logger.empty("#-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=#");
    this.manager.logger.empty(" ");
    this.manager.logger.empty(`                    • ${chalk.hex("#57ff6b").bold(`ItsMyBot v${this.manager.managerOptions.package.version}`)} is now Online! •`);
    this.manager.logger.empty(" ");
    this.manager.logger.empty("         • Join our Discord Server for any Issues/Custom Plugin •");
    this.manager.logger.empty(`                       ${chalk.blue(chalk.underline(`https://discord.gg/itsme-to`))}`);
    this.manager.logger.empty(" ");
    this.manager.logger.empty("#-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=#");
    this.manager.logger.info("Bot ready");

    schedule('0 * * * *', () => {
      this.manager.client.emit('everyHour');
    });

    schedule('* * * * *', () => {
      this.manager.client.emit('everyMinute');
    });

    let isPrimaryGuild = false;
    for (const guild of client.guilds.cache.values()) {
      if (guild.id === this.manager.primaryGuildId) {
        isPrimaryGuild = true;
        break;
      }
    }

    if (isPrimaryGuild) {
      this.manager.logger.info(`${client.guilds.cache.size} guilds found`);
      this.manager.logger.info(`Connected to ${chalk.hex("#ffbe0b")(client.guilds.cache.get(this.manager.primaryGuildId)!.name)}`);
    } else {
      this.manager.logger.error("Primary Guild not found");
      this.manager.logger.error("Please invite the bot to the primary guild");
      this.manager.logger.error(chalk.blue(chalk.underline(`https://discord.com/api/oauth2/authorize?client_id=${this.manager.client.user!.id}&permissions=8&scope=applications.commands%20bot`)));
      process.exit(1);
    }

    this.manager.client.emit(Events.BotReady);
  }
};