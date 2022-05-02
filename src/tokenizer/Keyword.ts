import { Parser } from "../Parser"
import { Result, StringParser } from "./util"

export class KeywordResult extends Result {
  constructor() {
    super(null)
  }
}

export class WhereKeywordResult extends KeywordResult {}
export class DoesKeywordResult extends KeywordResult {}
export class EndKeywordResult extends KeywordResult {}
export class FnDeclKeywordResult extends KeywordResult {}
export class VarDeclKeywordReslt extends KeywordResult {}
export class ConstDeclKeywordResult extends KeywordResult {}
export class ClassKeywordResult extends KeywordResult {}

export class KeywordParser extends Parser<string, Result> {
  parse(input: string) {
    return new StringParser("where")
      .map(() => new WhereKeywordResult())
      .or(new StringParser("does").map(() => new DoesKeywordResult()))
      .or(new StringParser("end").map(() => new EndKeywordResult()))
      .or(new StringParser("def").map(() => new FnDeclKeywordResult()))
      .or(new StringParser("let").map(() => new ConstDeclKeywordResult()))
      .or(new StringParser("var").map(() => new VarDeclKeywordReslt()))
      .or(new StringParser("class").map(() => new ClassKeywordResult()))
      .parse(input)
  }
}
