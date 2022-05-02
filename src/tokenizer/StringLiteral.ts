import { Parser, ParserError, ParserResult } from "../Parser"
import { Result, StringParser } from "./util"

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

export class NotQuoteParser extends Parser<string, string> {
  constructor(private quoteType: '"' | "'") {
    super()
  }

  parse(input: string) {
    const invaidCase = new StringParser(this.quoteType).parse(input)

    if (!invaidCase.isErrored) {
      return new ParserResult<string, string>(input, new IsQuoteParserError())
    }

    return new StringParser(`\\${this.quoteType}`)
      .map<string>(() => this.quoteType)
      .or(new AnyCharParser())
      .parse(input)
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
      .map((results) => new StringResult(results.join("")))
      .parse(input)
  }
}
