import { ClassParentResult } from "./ClassParent"
import { ExpressionResult } from "./Expression"

export class ClassResult extends ExpressionResult {
  constructor(
    public name: string,
    public parents: ClassParentResult[],
    public body: ExpressionResult[]
  ) {
    super(null)
  }
}
