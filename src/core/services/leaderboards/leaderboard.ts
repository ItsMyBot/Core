import { Base } from '@contracts';
import { Plugin } from '@itsmybot';

export abstract class Leaderboard<T extends Plugin | undefined = undefined> extends Base<T>{
  abstract name: string;
  abstract description: string;

  abstract getData(): Promise<string[]>;
}
