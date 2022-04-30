import { Parser, ParserResult } from "../Parser"
import {
  AnyCharParser,
  IsQuoteParserError,
  NotQuoteResult,
} from "./StringLiteral"
import { Result, StringParser } from "./util"

export class NotQuoteParser extends Parser<string, Result> {
  constructor(private quoteType: '"' | "'") {
    super()
  }

  parse(input: string) {
    const invaidCase = new StringParser(this.quoteType).parse(input)

    if (!invaidCase.isErrored) {
      return new ParserResult<string, Result>(input, new IsQuoteParserError())
    }

    return new StringParser(`\\${this.quoteType}`)
      .map<string>((result) => this.quoteType)
      .or(new AnyCharParser())
      .map((result) => new NotQuoteResult(result))
      .parse(input)
  }
}
