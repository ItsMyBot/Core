import { Mutator } from '../mutator.js';
import { Config } from '@itsmybot';
import { Context, Variable } from '@contracts';
import Utils from '@utils';

export class MemberMutator extends Mutator {
  async apply(args: Config, context: Context, variables: Variable[]) {
    const member = await Utils.applyVariables(args.getStringOrNull("member"), variables, context)
    if (!member) {
      this.missingArgument("member");
      return context
    }

    const newMember = await context.member?.guild.members.fetch(member)
    if (!newMember) return context

    const newUser = await this.manager.services.user.findOrCreate(newMember)
    context.user = newUser
    context.member = newMember

    return context
  }
}