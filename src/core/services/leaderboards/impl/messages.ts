import { Leaderboard } from '../leaderboard.js';
import { Sequelize, Op } from 'sequelize';
import { User } from '@itsmybot';
import Utils from '@utils';

export class MessagesLeaderboard extends Leaderboard {

  name = "Messages"
  description = "Messages leaderboard."

  async getData() {

    let data = await User.findAll({
      order: Sequelize.col('messages'),
      where: {
        messages: {
          [Op.gt]: 0
        }
      }
    })
    data.reverse()

    const messageFormat = this.manager.configs.lang.getString("leaderboard.messages-format")

    const formattedData = data.map((user, index) => {
      return Utils.applyVariables(messageFormat, [
        { searchFor: "%position%", replaceWith: index + 1 },
      ], {
        user: user
      })
    })

    return Promise.all(formattedData)
  }
}
