import { Context, Variable } from '@contracts';
import { BaseScript } from '@itsmybot';

export class CustomCommand extends BaseScript {

  async run(context: Context, variables: Variable[]) {
    if (!await this.meetsConditions(context, variables)) return;

    this.actions.forEach(action => action.run(context, variables));
  }
}