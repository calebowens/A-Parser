import { Parser } from "../Parser"
import { Result, StringParser } from "./util"

export class ArrowResult extends Result {
  constructor() {
    super(null)
  }
}

export class ArrowParser extends Parser<string, Result> {
  parse(input: string) {
    return new StringParser("=>").map(() => new ArrowResult()).parse(input)
  }
}
