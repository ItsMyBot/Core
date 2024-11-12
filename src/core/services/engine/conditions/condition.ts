import { Plugin, ConditionData } from '@itsmybot';
import { Base, Context, Variable } from '@contracts';

export abstract class Condition<T extends Plugin | undefined = undefined> extends Base<T> {
  abstract isMet(condition: ConditionData, context: Context, variables: Variable[]): Promise<boolean> | boolean
}