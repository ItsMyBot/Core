import { Collection, time } from 'discord.js';

export class Cooldown {
  duration: number;
  users: Collection<string, number>;

  constructor(durationInSeconds: number) {
    this.duration = durationInSeconds * 1000;
    this.users = new Collection();
  }

  public isOnCooldown(userId: string): boolean {
    if (!this.users.has(userId)) return false;
    const now = new Date().getTime();
    const lastUsed = this.users.get(userId);
    if (lastUsed === undefined) {
      throw new Error(`Expected a timestamp for user ${userId}, but none was found.`);
    }

    return now - lastUsed < this.duration;
  }

  public setCooldown(userId: string): boolean {
    if (this.isOnCooldown(userId)) return false

    this.users.set(userId, new Date().getTime());
    return true;
  }

  public getRemainingTime(userId: string): number {
    if (!this.users.has(userId)) return 0;
    const now = new Date().getTime();
    const lastUsed = this.users.get(userId);
    if (lastUsed === undefined) {
      throw new Error(`Expected a timestamp for user ${userId}, but none was found.`);
    }
    const timeElapsed = now - lastUsed;
    return Math.max(0, this.duration - timeElapsed);
  }

  public reset(userId: string) {
    this.users.delete(userId);
  }

  public resetAll() {
    this.users.clear();
  }

  public endsAtFormatted(userId: string): string {
    if (!this.users.has(userId)) {
      throw new Error(`User ${userId} is not in cooldown.`);
    }
    const lastUsed = this.users.get(userId);
    if (lastUsed === undefined) {
      throw new Error(`Expected a timestamp for user ${userId}, but none was found.`);
    }
    return time(Math.round((lastUsed + this.duration) / 1000), "R");
  }
}
