import { Parser, ParserError, ParserResult } from "../Parser"
import { Result } from "../tokenizer/util"

export class NotInstanceParserError extends ParserError {
  description = "not match of parser type"
}

export class InstanceOfParser<SpecialResult extends Result> extends Parser<
  Result[],
  SpecialResult
> {
  constructor(private target: new (...args: any[]) => SpecialResult) {
    super()
  }

  parse(input: Result[]) {
    if (input[0] instanceof this.target) {
      return new ParserResult(input.slice(1), input[0])
    } else {
      return new ParserResult<Result[], SpecialResult>(
        input,
        new NotInstanceParserError()
      )
    }
  }
}
