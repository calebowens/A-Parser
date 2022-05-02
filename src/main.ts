import { Tokenizer } from "./tokenizer/Tokenizer"
import { Result } from "./tokenizer/util"
import { TreeBuilderParser } from "./treeBuilder/TreeBuilder"
import { inspect } from "util"
import { NumericExpressionParser } from "./treeBuilder/NumericExpression"
import { ExpressionParser } from "./treeBuilder/Expression"

const testString = `
let foo = 5**3-25/3**-1*4+3**(4+0.2)

class Foo
  parent: Parent
where
  param: Number = 123.5

  def multiplies
    value: Number
  does
    param = param * value
  end
end
`

const tokenizer = new Tokenizer()
const tokens = tokenizer.parse(testString)
const treeBuilder = new TreeBuilderParser()

console.log("testString: ", testString)

console.log(inspect(treeBuilder.parse(tokens.output as Result[]), false, 20, true))
