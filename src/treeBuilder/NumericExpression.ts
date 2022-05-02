import { Parser, ParserError, ParserResult } from "../Parser"
import { NumberLiteralResult } from "../tokenizer/NumberLiteral"
import {
  AdditionSymbolResult,
  ArithmaticResult,
  DivisionSymbolResult,
  ExponentSymbolResult,
  IntDivisionSymbolResult,
  MultiplicationSymbolResult,
  SubtrationSymbolResult,
} from "../tokenizer/Symbol"
import { Result } from "../tokenizer/util"
import { InstanceOfParser } from "./util"
import { ClassResult } from "./Class"
import { FunctionResult } from "./Function"
import { ExpressionResult, ExpressionParser } from "./Expression"
import { StringResult } from "../tokenizer/StringLiteral"

export class NumericExpressionResult extends ExpressionResult {
  constructor(
    public left: ExpressionResult,
    public operator: ArithmaticResult,
    public right: ExpressionResult
  ) {
    super(null)
  }
}
class SubNumericParser extends Parser<Result[], Result[]> {
  constructor(private operators: (new (...args: any[]) => ArithmaticResult)[]) {
    super()
  }

  parse(input: Result[]) {
    const operatorLocation = input.findIndex((value) =>
      this.operators
        .map((operator) => value instanceof operator)
        .reduce((a, b) => a || b, false)
    )

    if (operatorLocation === -1) {
      return new ParserResult<Result[], Result[]>(input, new ParserError())
    }

    const result = new NumericExpressionResult(
      input[operatorLocation - 1] as ExpressionResult,
      input[operatorLocation] as ArithmaticResult,
      input[operatorLocation + 1] as ExpressionResult
    )

    return new ParserResult(
      [
        ...input.slice(0, operatorLocation - 1),
        result,
        ...input.slice(operatorLocation + 2),
      ],
      [
        ...input.slice(0, operatorLocation - 1),
        result,
        ...input.slice(operatorLocation + 2),
      ]
    )
  }
}
class OutputToInputParser<T> extends Parser<T, T> {
  constructor(private subject: Parser<T, T>) {
    super()
  }

  parse(input: T) {
    const result = this.subject.parse(input)

    if (result.output instanceof ParserError) {
      return result
    }

    return new ParserResult(result.output, result.input)
  }
}
class PopFirstIfSuccededParser<A, B> extends Parser<A[], B> {
  constructor(private subject: Parser<A[], B>) {
    super()
  }

  parse(input: A[]) {
    const result = this.subject.parse(input)

    if (result.output instanceof ParserError) {
      return result
    }

    return new ParserResult(result.input.slice(1), result.output)
  }
}
class PreserveEndParser<A> extends Parser<A[], A[]> {
  constructor(
    private lhs: Parser<A[], A[]>,
    private rhs: (parser: A[]) => ParserResult<A[], A[]>
  ) {
    super()
  }

  parse(input: A[]) {
    const result = this.lhs.parse(input)

    if (result.output instanceof ParserError) {
      return result
    }

    const secondResult = this.rhs(result.input)

    secondResult.input = [...secondResult.input, ...result.output] as A[]

    return secondResult
  }
}

export class NumericExpressionParser extends Parser<Result[], Result> {
  parse(input: Result[]) {
    const expression: Parser<Result[], Result> = new ExpressionParser()
      .or(new InstanceOfParser(NumberLiteralResult))
      .or(new InstanceOfParser(StringResult))
      .outputNotInstance(ClassResult)
      .outputNotInstance(FunctionResult)

    return new PopFirstIfSuccededParser(
      new PreserveEndParser(
        new OutputToInputParser(
          expression
            .and(new InstanceOfParser(ArithmaticResult))
            .span()
            .and(expression)
            .map((result) => [...result.flat(Infinity)] as Result[])
        ),
        (result) =>
          new SubNumericParser([ExponentSymbolResult])
            .span()
            .map((result) => result[result.length - 1] as Result[])
            .impliesILeft(
              new SubNumericParser([
                MultiplicationSymbolResult,
                DivisionSymbolResult,
                IntDivisionSymbolResult,
              ])
                .span()
                .map((result) => result[result.length - 1] as Result[])
            )
            .impliesILeft(
              new SubNumericParser([AdditionSymbolResult, SubtrationSymbolResult])
                .span()
                .map((result) => result[result.length - 1] as Result[])
            )
            .parse(result)
      ).map((result) => result.flat(Infinity)[0] as Result)
    ).parse(input)
  }
}
