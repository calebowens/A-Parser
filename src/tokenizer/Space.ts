import { Parser } from "../Parser"
import { Result, StringParser } from "./util"

export class SpaceResult extends Result {
  constructor(value: string) {
    super(value)
  }
}

export class SpaceParser extends Parser<string, Result> {
  parse(input: string) {
    return new StringParser(" ")
      .or(new StringParser("\t"))
      .or(new StringParser("\n"))
      .map((result) => new SpaceResult(result))
      .parse(input)
  }
}
