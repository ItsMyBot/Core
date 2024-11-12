import { Condition, ConditionData } from '@itsmybot';
import { Context, Variable } from '@contracts';
import Utils from '@utils';

export class ExpressionCondition extends Condition {
  async isMet(condition: ConditionData, context: Context, variables: Variable[]) {
    const input = condition.args.getStringOrNull("input")
    const operator = condition.args.getStringOrNull("operator")
    const output = condition.args.getStringOrNull("output")

    if (!input) return condition.missingArg("input");
    if (!operator) return condition.missingArg("operator");
    if (!output) return condition.missingArg("output");

    const inputNumber = parseFloat(await Utils.applyVariables(input, variables, context));
    const outputNumber = parseFloat(await Utils.applyVariables(output, variables, context));
 
    if (isNaN(inputNumber)) return condition.invalidArg("input", "Invalid number");
    if (isNaN(outputNumber)) return condition.invalidArg("output", "Invalid number");

    switch (operator) {
      case "==":
        return inputNumber === outputNumber;
      case "!=":
        return inputNumber !== outputNumber;
      case ">":
        return inputNumber > outputNumber;
      case "<":
        return inputNumber < outputNumber;
      case ">=":
        return inputNumber >= outputNumber;
      case "<=":
        return inputNumber <= outputNumber;
      default:
        return condition.invalidArg("operator", "Invalid operator");
    }
  }
}