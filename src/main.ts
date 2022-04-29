class ParserError {
  description = "parser error";
}

class ParserOutput<T> {
  constructor(public value: T | ParserError) {}

  get isErrored() {
    return this.value instanceof ParserError;
  }

  map<U>(fn: (a: T) => U) {
    if (this.value instanceof ParserError) {
      return new ParserOutput<U>(this.value);
    } else {
      return new ParserOutput<U>(fn(this.value));
    }
  }
}

class ParserResult<T> {
  constructor(public input: string, public output: ParserOutput<T>) {}

  map<U>(fn: (a: T) => U) {
    return new ParserResult<U>(this.input, this.output.map(fn));
  }
}

abstract class Parser<Input, Output> {
  abstract parse(input: Input): ParserResult<Output>;

  map<U>(fn: (a: Output) => U) {
    const self = this;

    return new (class extends Parser<Input, U> {
      parse(input: Input) {
        return self.parse(input).map(fn);
      }
    })();
  }

  or(parser: Parser<Input, Output>) {
    const self = this;

    return new (class extends Parser<Input, Output> {
      parse(input: Input) {
        const parsedValue = self.parse(input);

        if (parsedValue.output.isErrored) {
          return parser.parse(input);
        } else {
          return parsedValue;
        }
      }
    })();
  }
}

class ParserErrorNoMatch extends ParserError {
  description = "string failed to match";
}

class StringParser extends Parser<string, string> {
  constructor(private term: string) {
    super();
  }

  parse(input: string) {
    if (input.startsWith(this.term)) {
      return new ParserResult(input.slice(this.term.length), new ParserOutput(this.term));
    } else {
      return new ParserResult(input, new ParserOutput<string>(new ParserErrorNoMatch()));
    }
  }
}

class BooleanParser extends Parser<string, boolean> {
  parse(input: string) {
    return new StringParser("true")
      .map(() => true)
      .or(new StringParser("false").map(() => false))
      .parse(input);
  }
}

const testString = "true test string";

const boolParser = new BooleanParser();

console.log("testString: ", testString);
console.log(boolParser.parse(testString));
