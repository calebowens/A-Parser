import { Parser } from "../Parser"
import { Result, StringParser } from "./util"

export class BooleanResult extends Result {
  constructor(value: boolean) {
    super(value)
  }
}

export class BooleanParser extends Parser<string, Result> {
  parse(input: string) {
    return new StringParser("true")
      .map(() => new BooleanResult(true))
      .or(new StringParser("false").map(() => new BooleanResult(false)))
      .parse(input)
  }
}
