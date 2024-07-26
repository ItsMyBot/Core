import { Manager, Leaderboard, Command } from '@itsmybot';
import {Collection } from 'discord.js';
import { CommandBuilder } from '@builders';

import { MessagesLeaderboard } from './impl/messages.js';
import { Pagination } from '@utils';
import { PaginationType, CommandInteraction } from '@contracts';

export default class LeaderboardService {
  manager: Manager;
  leaderboards: Collection<string, Leaderboard>;

  constructor(manager: Manager) {
    this.manager = manager;
    this.leaderboards = manager.leaderboards;
  }

  async initialize() {
    this.manager.logger.info("Leaderboard services initialized.");
    this.registerLeaderboard('messages', new MessagesLeaderboard(this.manager));
  }

  registerLeaderboard(identifier: string, leaderboard: Leaderboard) {
    if (this.leaderboards.has(identifier)) {
      return this.manager.logger.error(`An leaderboard with the identifier ${identifier} is already registered.`);
    }
    this.leaderboards.set(identifier, leaderboard);
  }

  unregisterLeaderboard(identifier: string) {
    this.leaderboards.delete(identifier);
  }

  async registerLeaderboards() {
    class LeaderboardCommands extends Command {
      data: CommandBuilder;

      constructor(manager: Manager) {
        super(manager);

        this.data = new CommandBuilder()
          .setName('leaderboard')
          .setConfig(this.manager.configs.commands.getSubsection('leaderboard'))

        for (const [key, leaderboard] of this.manager.services.leaderboard.leaderboards) {
          this.data.addSubcommand(subcommand =>
            subcommand
              .setName(key)
              .setDescription(leaderboard.description))
        }
      }

      async execute(interaction: CommandInteraction) {
        await this.manager.services.leaderboard.leaderboardCommand(interaction, interaction.options.getSubcommand());
      }
    }

    this.manager.services.command.registerCommand(new LeaderboardCommands(this.manager));
  }

  async leaderboardCommand(interaction: CommandInteraction, indentifier: string) {
    const leaderboard = this.leaderboards.get(indentifier)
    if (!leaderboard) return interaction.reply("Leaderboard not found.");

    const leaderboardData = await leaderboard.getData();


    new Pagination(this.manager, interaction, leaderboardData.map(item => { return { message: item } }), this.manager.configs.lang.getSubsection('leaderboard'))
      .setType(PaginationType.Button)
      .setVariables([{ searchFor: "%leaderboard_name%", replaceWith: leaderboard.name }])
      .setItemsPerPage(10)
      .send();
  }
}