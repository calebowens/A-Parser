import { Parser } from "../Parser"
import { LiteralResult } from "../tokenizer/Literal"
import { ColonSymbolResult } from "../tokenizer/Symbol"
import { Result } from "../tokenizer/util"
import { InstanceOfParser } from "./util"

export class TypedVariableResult extends Result {
  constructor(public subject: LiteralResult, public type: LiteralResult) {
    super(null)
  }
}

export class TypedVariableParser extends Parser<Result[], Result> {
  parse(input: Result[]) {
    return new InstanceOfParser(LiteralResult)
      .andIRight(new InstanceOfParser(ColonSymbolResult))
      .and(new InstanceOfParser(LiteralResult))
      .map(([left, right]) => new TypedVariableResult(left, right))
      .parse(input)
  }
}
