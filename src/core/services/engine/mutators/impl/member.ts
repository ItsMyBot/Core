import { Mutator } from '../mutator.js';
import { Config } from '@itsmybot';
import { Context, Variable } from '@contracts';
import Utils from '@utils';

export class MemberMutator extends Mutator {

  public arguments() {
    return ["member"];
  }

  async apply(args: Config, context: Context, variables: Variable[]) {
    const newMember = await context.member?.guild.members.fetch(await Utils.applyVariables(args.getString("member"), variables, context))
    if (!newMember) return context

    const newUser = await this.manager.services.user.findOrCreate(newMember)
    context.user = newUser
    context.member = newMember

    return context
  }
}