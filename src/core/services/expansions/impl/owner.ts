import { Context } from '@contracts';
import { Expansion } from '../expansion.js';
import Utils from '@utils';

export class OwnerExpansion extends Expansion {

  async onRequest(context: Context, placeholder: string) {

    if (!context.guild) return "No guild found";
    const owner = await context.guild.fetchOwner()
    const ownerUser = await this.manager.services.user.findOrCreate(owner);

    return Utils.applyVariables(`%owner_${placeholder}%`, Utils.userVariables(ownerUser, 'owner'));
  }
}