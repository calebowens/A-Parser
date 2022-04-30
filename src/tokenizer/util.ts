import { Parser, ParserError, ParserResult } from "../Parser"

export class Result {
  constructor(public value: any) {}
}

class ParserErrorNoMatch extends ParserError {
  description = "string failed to match"
}

export class StringParser extends Parser<string, string> {
  constructor(private term: string) {
    super()
  }

  parse(input: string) {
    if (input.startsWith(this.term)) {
      return new ParserResult(input.slice(this.term.length), this.term)
    } else {
      return new ParserResult<string, string>(input, new ParserErrorNoMatch())
    }
  }
}
