import { StringLiteralParser } from "./StringLiteral"
import { Parser } from "../Parser"
import { Result } from "./util"
import { ArrowParser } from "./Arrow"
import { BooleanParser } from "./Boolean"
import { MultipleSpaceParser, MultipleSpaceParserResult } from "./MultipleSpace"
import { NumberLiteralParser } from "./NumberLiteral"
import { KeywordParser } from "./Keyword"
import { LiteralParser } from "./Literal"
import { SymbolParser } from "./Symbol"

export class Tokenizer extends Parser<string, Result[]> {
  parse(input: string) {
    return new KeywordParser()
      .or(new SymbolParser())
      .or(new StringLiteralParser())
      .or(new NumberLiteralParser())
      .or(new BooleanParser())
      .or(new ArrowParser())
      .or(new MultipleSpaceParser())
      .or(new LiteralParser())
      .span()
      .map((results) =>
        results.filter(
          (result) => !(result instanceof MultipleSpaceParserResult)
        )
      )
      .parse(input)
  }
}
