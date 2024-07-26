import { ActionScript } from '@itsmybot';
import { Context } from '@contracts';
import { Filter } from '../filter.js';

export class IsBotFilter extends Filter {

  public parameters() {
    return ["member"];
  }

  isMet(script: ActionScript, context: Context, args: boolean) {
    return args === context.member!.user.bot;
  }
}