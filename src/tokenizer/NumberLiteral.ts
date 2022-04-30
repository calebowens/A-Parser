import { Parser } from "../Parser"
import { Result, StringParser } from "./util"

export class NumberLiteralResult extends Result {
  constructor(value: number) {
    super(value)
  }
}

class AnyOfParser extends Parser<string, string> {
  constructor(private allowed: string[]) {
    super()
  }

  parse(input: string) {
    let parser: Parser<string, string> = new StringParser(this.allowed[0])
    this.allowed.forEach(
      (phrase) => (parser = parser.or(new StringParser(phrase)))
    )

    return parser.parse(input)
  }
}

export class NumberLiteralParser extends Parser<string, Result> {
  parse(input: string) {
    const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

    return new AnyOfParser(digits)
      .span()
      .andIRight(new StringParser("."))
      .and(new AnyOfParser(digits).span())
      .map(([left, right]) => `${left.join("")}.${right.join("")}`)
      .or(new AnyOfParser(digits).span().map((result) => result.join("")))
      .map((result) => new NumberLiteralResult(Number(result)))
      .parse(input)
  }
}
