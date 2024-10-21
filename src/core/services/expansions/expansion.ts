import { Context, Base } from '@contracts';
import { Plugin } from '@itsmybot';

export abstract class Expansion<T extends Plugin | undefined = undefined> extends Base<T>{
  abstract onRequest(context: Context, placeholderName: string): Promise<string | undefined>
}
