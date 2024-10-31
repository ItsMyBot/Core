import Utils from '@utils';
import { Manager, Event } from '@itsmybot';
import { Events } from '@contracts';

export default class BotReadyEvent extends Event {
  name = Events.BotReady;
  once = true;

  async execute() {
    const presence = this.manager.configs.config.getSubsection("presence");
    const activities = presence.getSubsections("activities");
    const status = Utils.presenceStatus(presence.getString("status"))
    let currentIndex = 0;

    if (status) this.manager.client.user.setStatus(status);
    else {
      this.logger.warn(`The status "${status}" is not valid. Must be one of "invisible", "dnd", "idle" or "online".`);
      this.manager.client.user.setStatus("online");
    }

    async function updateActivity(manager: Manager) {
      if (currentIndex >= activities.length) currentIndex = 0;

      const activity = await Utils.applyVariables(activities[currentIndex].getString("text"), [], {
        guild: manager.client.guilds.cache.get(manager.primaryGuildId)!
      });

      if (!activity) return manager.logger.warn(`Activity text is empty. Skipping...`);

      const type = Utils.activityType(activities[currentIndex].getString("type"));
      manager.client.user.setActivity(activity, { type: type });

      currentIndex++;
    };

    updateActivity(this.manager);
    setInterval(() => updateActivity(this.manager), presence.getNumber("interval") * 1000);
  }
};
