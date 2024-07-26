import { Collection } from 'discord.js';
import { ActionScript, Config, Manager, Script, Condition, CustomCommand } from '@itsmybot';
import { Context } from '@contracts';

import { AboveMembersCondition } from './impl/aboveMembers.js';
import { BellowMembersCondition } from './impl/bellowMembers.js';

export class ConditionHandler {
  manager: Manager;
  conditions: Collection<string, Condition>;

  constructor(manager: Manager) {
    this.manager = manager;
    this.conditions = new Collection();
  }

  registerCondition(id: string, condition: Condition) {
    if (this.conditions.has(id)) return condition.logger.warn(`Condition ${id} is already registered`);

    this.conditions.set(id, condition);
  }

  async isConditionMet(conditionData: Config, script: ActionScript | Script | CustomCommand, context: Context) {
    const condition = this.conditions.get(conditionData.getString("id"));
    if (!condition) {
      this.manager.logger.warn(`No condition found for ID: ${conditionData.getString("id")}`);
      return false;
    }

    const conditionParameters = condition.parameters().filter(param => !(param in context));
    for (const param of conditionParameters) {
      this.manager.logger.error(`${conditionData.getString("id")} need the parameter '${param}'`);
      return false;
    }

    const conditionArguments = condition.arguments().filter(argument => !conditionData.has(`args.${argument}`));
    for (const argument of conditionArguments) {
      this.manager.logger.error(`${conditionData.getString("id")} need the argument '${argument}'`);
      return false;
    }

    return condition.isMet(script, context, conditionData.getSubsection("args"));
  }

  initialize() {
    this.registerCondition("aboveMembers", new AboveMembersCondition(this.manager));
    this.registerCondition("bellowMembers", new BellowMembersCondition(this.manager));
  }
}