import { Parser, ParserError, ParserResult } from "../Parser"
import { NotQuoteParser } from "./NotQuote"
import { Result, StringParser } from "./util"

export class NotQuoteResult extends Result {
  constructor(value: string) {
    super(value)
  }
}

export class IsQuoteParserError extends ParserError {
  description = "subject is unescaped ' or \""
}

export class AnyCharParser extends Parser<string, string> {
  parse(input: string) {
    return new ParserResult(input.slice(1), input.slice(0, 1))
  }
}

export class StringResult extends Result {
  constructor(value: string) {
    super(value)
  }
}

export class StringLiteralParser extends Parser<string, Result> {
  parse(input: string) {
    function fromQuoteType(quoteType: '"' | "'") {
      return new StringParser(quoteType)
        .andILeft(new NotQuoteParser(quoteType).span())
        .andIRight(new StringParser(quoteType))
    }

    return fromQuoteType('"')
      .or(fromQuoteType("'"))
      .map(
        (results) =>
          new StringResult(results.map((result) => result.value).join(""))
      )
      .parse(input)
  }
}
