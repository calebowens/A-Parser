import { Parser } from "../Parser"
import { Result } from "../tokenizer/util"
import { ExpressionParser } from "./Expression"
import { NumericExpressionParser } from "./NumericExpression"

export class TreeBuilderParser extends Parser<Result[], Result[]> {
  parse(input: Result[]) {
    return new ExpressionParser().or(new NumericExpressionParser()).span().parse(input)
  }
}
