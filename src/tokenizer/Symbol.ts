import { Parser } from "../Parser"
import { Result, StringParser } from "./util"

export class SymbolResult extends Result {
  constructor() {
    super(null)
  }
}

export class AssignmentResult extends SymbolResult {}
export class ComparisonResult extends SymbolResult {}
export class ArithmaticResult extends SymbolResult {}

export class AssignmentAdditionSymbolResult extends AssignmentResult {}
export class AssignmentMultiplicationSymbolResult extends AssignmentResult {}
export class AssignmentDivisionSymbolResult extends AssignmentResult {}
export class AssignmentIntDivisionSymbolResult extends AssignmentResult {}
export class AssignmentSubtrationSymbolResult extends AssignmentResult {}
export class AssignmentExponentSymbolResult extends AssignmentResult {}
export class GreaterThanSymbolResult extends ComparisonResult {}
export class GreaterThanEqualSymbolResult extends ComparisonResult {}
export class LessThanSymbolResult extends ComparisonResult {}
export class LessThanEqualSymbolResult extends ComparisonResult {}
export class FatArrowSymbolResult extends SymbolResult {}
export class ThinArrowSymbolResult extends SymbolResult {}
export class ColonSymbolResult extends SymbolResult {}
export class AssignmentSymbolResult extends AssignmentResult {}
export class EqualitySymbolResult extends ComparisonResult {}
export class InstanceOfSymbolResult extends ComparisonResult {}
export class AdditionSymbolResult extends ArithmaticResult {}
export class MultiplicationSymbolResult extends ArithmaticResult {}
export class DivisionSymbolResult extends ArithmaticResult {}
export class IntDivisionSymbolResult extends ArithmaticResult {}
export class SubtrationSymbolResult extends ArithmaticResult {}
export class ExponentSymbolResult extends ArithmaticResult {}
export class OpenParenSymbolResult extends SymbolResult {}
export class CloseParenSymbolResult extends SymbolResult {}

export class SymbolParser extends Parser<string, Result> {
  parse(input: string) {
    return new StringParser("+=")
      .map(() => new AssignmentAdditionSymbolResult())
      .or(new StringParser("**=").map(() => new AssignmentExponentSymbolResult()))
      .or(new StringParser("*=").map(() => new AssignmentMultiplicationSymbolResult()))
      .or(new StringParser("/=").map(() => new AssignmentDivisionSymbolResult()))
      .or(new StringParser("//=").map(() => new AssignmentIntDivisionSymbolResult()))
      .or(new StringParser("-=").map(() => new AssignmentSubtrationSymbolResult()))
      .or(new StringParser(">").map(() => new GreaterThanSymbolResult()))
      .or(new StringParser(">=").map(() => new GreaterThanEqualSymbolResult()))
      .or(new StringParser("<").map(() => new LessThanSymbolResult()))
      .or(new StringParser("<=").map(() => new LessThanEqualSymbolResult()))
      .or(new StringParser("=>").map(() => new FatArrowSymbolResult()))
      .or(new StringParser("->").map(() => new ThinArrowSymbolResult()))
      .or(new StringParser(":").map(() => new ColonSymbolResult()))
      .or(new StringParser("==").map(() => new EqualitySymbolResult()))
      .or(new StringParser("=").map(() => new AssignmentSymbolResult()))
      .or(new StringParser("is").map(() => new InstanceOfSymbolResult()))
      .or(new StringParser("+").map(() => new AdditionSymbolResult()))
      .or(new StringParser("**").map(() => new ExponentSymbolResult()))
      .or(new StringParser("*").map(() => new MultiplicationSymbolResult()))
      .or(new StringParser("/").map(() => new DivisionSymbolResult()))
      .or(new StringParser("//").map(() => new IntDivisionSymbolResult()))
      .or(new StringParser("-").map(() => new SubtrationSymbolResult()))
      .or(new StringParser("(").map(() => new OpenParenSymbolResult()))
      .or(new StringParser(")").map(() => new CloseParenSymbolResult()))
      .parse(input)
  }
}
