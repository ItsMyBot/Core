import { Context } from '@contracts';
import { Expansion } from '../expansion.js';

export default class MathExpansion extends Expansion {
  name = 'math';

  async onRequest(context: Context, placeholder: string) {

    if (/^[0-9+\-*/.() ]+$/.test(placeholder)) {
      try {
        const result = eval(placeholder);
        return result.toString();
      } catch (error) {
        this.logger.error("Error while calculating expression: " + error)
        return "Calcul error";
      }
    } else {
      return "Invalid expression";
    }
  }
}