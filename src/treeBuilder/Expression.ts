import { Parser } from "../Parser"
import { ConstDeclKeywordResult, VarDeclKeywordReslt } from "../tokenizer/Keyword"
import { LiteralResult } from "../tokenizer/Literal"
import { NumberLiteralResult } from "../tokenizer/NumberLiteral"
import { StringResult as StringLiteralResult } from "../tokenizer/StringLiteral"
import {
  AssignmentResult,
  CloseParenSymbolResult,
  OpenParenSymbolResult,
  SubtrationSymbolResult,
} from "../tokenizer/Symbol"
import { Result } from "../tokenizer/util"
import { TypedVariableParser, TypedVariableResult } from "./TypedVariable"
import { InstanceOfParser } from "./util"

export class ExpressionResult extends Result {}

import { NumericExpressionParser } from "./NumericExpression"
import { TreeBuilderParser } from "./TreeBuilder"

export class AssignmentExpressionResult extends Result {
  constructor(
    public target: LiteralResult | TypedVariableResult,
    public operator: AssignmentResult,
    public assignee: ExpressionResult
  ) {
    super(null)
  }
}
export class DeclAssignmentExpressionResult extends AssignmentExpressionResult {
  constructor(
    public isConstant: boolean,
    target: LiteralResult | TypedVariableResult,
    operator: AssignmentResult,
    assignee: ExpressionResult
  ) {
    super(target, operator, assignee)
  }
}

class AssignmentExpressionParser extends Parser<Result[], Result> {
  parse(input: Result[]) {
    return new InstanceOfParser(ConstDeclKeywordResult)
      .or(new InstanceOfParser(VarDeclKeywordReslt))
      .and(
        new TypedVariableParser()
          .or(new InstanceOfParser(LiteralResult))
          .and(new InstanceOfParser(AssignmentResult))
          .and(
            new NumericExpressionParser().or(
              new ExpressionParser().outputNotInstance(AssignmentExpressionResult)
            )
          )
          .map(([[target, operator], assignee]) => [
            target as LiteralResult | TypedVariableResult,
            operator as AssignmentResult,
            assignee as ExpressionResult,
          ]) as Parser<
          Result[],
          [LiteralResult | TypedVariableResult, AssignmentResult, ExpressionResult]
        >
      )
      .map<AssignmentExpressionResult>(
        ([varType, assignmentExpression]) =>
          new DeclAssignmentExpressionResult(
            varType instanceof ConstDeclKeywordResult,
            ...assignmentExpression
          )
      )
      .or(
        (
          new InstanceOfParser(LiteralResult)
            .and(new InstanceOfParser(AssignmentResult))
            .and(
              new NumericExpressionParser().or(
                new ExpressionParser().outputNotInstance(AssignmentExpressionResult)
              )
            )
            .map(([[target, operator], assignee]) => [
              target,
              operator,
              assignee,
            ]) as Parser<Result[], [LiteralResult, AssignmentResult, ExpressionResult]>
        ).map(
          (assignmentExpression) =>
            new AssignmentExpressionResult(...assignmentExpression)
        )
      )
      .parse(input)
  }
}

export class BracketExpressionResult extends ExpressionResult {}

export class BracketExpressionParser extends Parser<Result[], Result> {
  parse(input: Result[]) {
    return new InstanceOfParser(OpenParenSymbolResult)
      .andILeft(new TreeBuilderParser())
      .andIRight(new InstanceOfParser(CloseParenSymbolResult))
      .map((result) => new BracketExpressionResult(result))
      .parse(input)
  }
}

export class NegativeNumberParser extends Parser<Result[], Result> {
  parse(input: Result[]) {
    return new InstanceOfParser(SubtrationSymbolResult)
      .andILeft(new InstanceOfParser(NumberLiteralResult))
      .map((result) => new NumberLiteralResult(-result.value))
      .parse(input)
  }
}

export class ExpressionParser extends Parser<Result[], Result> {
  parse(input: Result[]) {
    return new BracketExpressionParser()
      .or(new NegativeNumberParser())
      .or(new AssignmentExpressionParser())
      .or(
        new InstanceOfParser(LiteralResult).map((result) => new ExpressionResult(result))
      )
      .parse(input)
  }
}
