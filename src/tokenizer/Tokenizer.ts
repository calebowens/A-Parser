import { StringLiteralParser } from "./StringLiteral"
import { Parser } from "../Parser"
import { Result } from "./util"
import { ArrowParser } from "./Arrow"
import { BooleanParser } from "./Boolean"
import { MultipleSpaceParser } from "./MultipleSpace"
import { NumberLiteralParser } from "./NumberLiteral"

export class Tokenizer extends Parser<string, Result[]> {
  parse(input: string) {
    return new StringLiteralParser()
      .or(new NumberLiteralParser())
      .or(new BooleanParser())
      .or(new ArrowParser())
      .or(new MultipleSpaceParser())
      .span()
      .parse(input)
  }
}
