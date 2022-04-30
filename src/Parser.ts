export class ParserError {
  description = "parser error"
}
export class ParserResult<Input, Output> {
  constructor(public input: Input, public output: Output | ParserError) {}

  get isErrored() {
    return this.output instanceof ParserError
  }

  map<U>(fn: (a: Output) => U) {
    if (this.output! instanceof ParserError) {
      return new ParserResult<Input, U>(this.input, this.output)
    } else {
      return new ParserResult(this.input, fn(this.output))
    }
  }
}

export abstract class Parser<Input, Output> {
  abstract parse(input: Input): ParserResult<Input, Output>

  map<U>(fn: (a: Output) => U) {
    const self = this

    return new (class extends Parser<Input, U> {
      parse(input: Input) {
        return self.parse(input).map(fn)
      }
    })()
  }

  mapError(errorType: new () => ParserError, newError: ParserError) {
    const self = this

    return new (class extends Parser<Input, Output> {
      parse(input: Input) {
        const parsedValue = self.parse(input)

        if (parsedValue.output instanceof errorType) {
          parsedValue.output = newError
        }

        return parsedValue
      }
    })()
  }

  or(parser: Parser<Input, Output>) {
    const self = this

    return new (class extends Parser<Input, Output> {
      parse(input: Input) {
        const parsedValue = self.parse(input)

        if (parsedValue.isErrored) {
          return parser.parse(input)
        } else {
          return parsedValue
        }
      }
    })()
  }

  and<AlternateOutput>(parser: Parser<Input, AlternateOutput>) {
    const self = this

    return new (class extends Parser<Input, [Output, AlternateOutput]> {
      parse(input: Input) {
        const parserResult = self.parse(input)

        if (parserResult.output instanceof ParserError) {
          return new ParserResult<Input, [Output, AlternateOutput]>(
            parserResult.input,
            parserResult.output
          )
        }
        const otherResult = parser.parse(parserResult.input)

        if (otherResult.output instanceof ParserError) {
          return new ParserResult<Input, [Output, AlternateOutput]>(
            otherResult.input,
            otherResult.output
          )
        }

        return new ParserResult<Input, [Output, AlternateOutput]>(
          otherResult.input,
          [parserResult.output, otherResult.output]
        )
      }
    })()
  }

  andILeft<AlternateOutput>(parser: Parser<Input, AlternateOutput>) {
    const self = this

    return new (class extends Parser<Input, AlternateOutput> {
      parse(input: Input) {
        const parserResult = self.parse(input)

        if (parserResult.output instanceof ParserError) {
          return new ParserResult<Input, AlternateOutput>(
            parserResult.input,
            parserResult.output
          )
        }
        const otherResult = parser.parse(parserResult.input)

        if (otherResult.output instanceof ParserError) {
          return new ParserResult<Input, AlternateOutput>(
            otherResult.input,
            otherResult.output
          )
        }

        return new ParserResult<Input, AlternateOutput>(
          otherResult.input,
          otherResult.output
        )
      }
    })()
  }

  andIRight<AlternateOutput>(parser: Parser<Input, AlternateOutput>) {
    const self = this

    return new (class extends Parser<Input, Output> {
      parse(input: Input) {
        const parserResult = self.parse(input)

        if (parserResult.output instanceof ParserError) {
          return new ParserResult<Input, Output>(
            parserResult.input,
            parserResult.output
          )
        }
        const otherResult = parser.parse(parserResult.input)

        if (otherResult.output instanceof ParserError) {
          return new ParserResult<Input, Output>(
            otherResult.input,
            otherResult.output
          )
        }

        return new ParserResult<Input, Output>(
          otherResult.input,
          parserResult.output
        )
      }
    })()
  }

  span() {
    const self = this

    return new (class extends Parser<Input, Output[]> {
      parse(input: Input) {
        let parsedValue = self.parse(input)

        if (parsedValue.isErrored) {
          return parsedValue.map((a) => [a])
        }

        const output: ParserResult<Input, Output>[] = [parsedValue]

        while (!parsedValue.isErrored) {
          parsedValue = self.parse(parsedValue.input)

          if (!parsedValue.isErrored) {
            output.push(parsedValue)
          }
        }

        return new ParserResult<Input, Output[]>(
          parsedValue.input,
          output.map((value) => value.output).filter((a) => a) as Output[]
        )
      }
    })()
  }
}
