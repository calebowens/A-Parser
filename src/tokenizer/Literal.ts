import { isJsxOpeningElement } from "typescript"
import { Parser, ParserError, ParserResult } from "../Parser"
import { Result } from "./util"

export class LiteralResult extends Result {
  constructor(value: string) {
    super(value)
  }
}

export class ClassLiteralResult extends Result {}

class NotLiteralCharacterParserError extends ParserError {
  description = "not a legal literal character"
}

class LiteralCharParser extends Parser<string, string> {
  parse(input: string) {
    if (/^([A-Z]|[a-z]|_)/.test(input)) {
      return new ParserResult(input.slice(1), input.slice(0, 1))
    } else {
      return new ParserResult<string, string>(
        input,
        new NotLiteralCharacterParserError()
      )
    }
  }
}

export class LiteralParser extends Parser<string, Result> {
  parse(input: string) {
    return new LiteralCharParser()
      .span()
      .map(
        (result) =>
          new LiteralResult(
            result
              .join("")
              .split(/(?=[A-Z])/)
              .join("_")
              .toLocaleLowerCase()
          )
      )
      .parse(input)
  }
}
