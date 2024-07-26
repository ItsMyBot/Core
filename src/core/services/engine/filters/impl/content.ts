import { Context } from '@contracts';
import { ActionScript } from '@itsmybot';
import { Filter } from '../filter.js';

export class ContentFilter extends Filter {

  public parameters() {
    return ["content"];
  }

  isMet(script: ActionScript, context: Context, args: string | string[]) {
    if (typeof args === 'string') args = [args];
    return args && args.some(text => context.content === text);
  }
}