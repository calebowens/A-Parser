import { Parser } from "../Parser"
import { SpaceParser } from "./Space"
import { Result } from "./util"

export class MultipleSpaceParserResult extends Result {
  constructor(value: string) {
    super(value)
  }
}
export class MultipleSpaceParser extends Parser<string, Result> {
  parse(input: string) {
    return new SpaceParser()
      .span()
      .map(
        (results) =>
          new MultipleSpaceParserResult(
            results.map((result) => result.value).join("")
          )
      )
      .parse(input)
  }
}
