import { Context } from '@contracts';
import { ActionScript, Filter } from '@itsmybot';

export class NotContentContainsFilter extends Filter {

  public parameters() {
    return ["content"];
  }

  isMet(script: ActionScript, context: Context, args: string | string[]) {
    if (typeof args === 'string') args = [args];
    return args && args.every(text => !context.content!.includes(text));
  }
}