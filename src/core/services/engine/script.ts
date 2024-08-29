import { Context } from '@contracts';
import { BaseScript } from '@itsmybot';

export class Script extends BaseScript {

  handleTrigger(trigger: string, context: Context) {
    if (!this.hasTrigger(trigger)) return;

    this.run(trigger, context)
  }

  async run(trigger: string, context: Context) {
    if (!await this.meetsConditions(context, [])) return;

    this.actions.forEach(action => action.handleTrigger(trigger, context));
  }

  hasTrigger(trigger: string) {
    for (const action of this.actions) {
      if (action.hasTrigger(trigger)) return true;
    }
    return false;
  }
}