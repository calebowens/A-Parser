import { Tokenizer } from "./tokenizer/Tokenizer"

const testString = `
100
1.212
1234.12
class Foo
  Parent => asParent
where
  def func does
  end
end
`

const boolParser = new Tokenizer()

console.log("testString: ", testString)
console.log(boolParser.parse(testString))
