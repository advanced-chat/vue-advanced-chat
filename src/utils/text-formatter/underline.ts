import type {
  CompileContext,
  Code,
  Effects,
  Extension,
  HtmlExtension,
  State,
} from 'micromark-util-types'

import { codes } from './codes.ts'

const underlineTokenize = (effects: Effects, ok: State, nok: State): State => {
  const inside: State = (code: Code) => {
    if (
      code === codes.carriageReturn ||
      code === codes.lineFeed ||
      code === codes.carriageReturnLineFeed ||
      code === codes.eof
    ) {
      return nok(code)
    }

    if (code === codes.backslash) {
      effects.consume(code)
      return insideEscape
    }

    if (code === codes.degree) {
      effects.exit('underlineContent')
      effects.enter('underlineMarker')
      effects.consume(code)
      effects.exit('underlineMarker')
      effects.exit('underline')
      return ok
    }

    effects.consume(code)
    return inside
  }

  const insideEscape: State = (code: Code) => {
    if (code === codes.backslash || code === codes.degree) {
      effects.consume(code)
      return inside
    }

    return inside(code)
  }

  const begin: State = (code: Code) => (code === codes.degree ? nok(code) : inside(code))

  return (code: Code) => {
    effects.enter('underline')
    effects.enter('underlineMarker')
    effects.consume(code)
    effects.exit('underlineMarker')
    effects.enter('underlineContent', { contentType: 'string' } as never)
    return begin
  }
}

const underlineConstruct = { name: 'underline', tokenize: underlineTokenize }

export const underline: Extension = { text: { 176: underlineConstruct } } // 176 is the code for `°`

export const underlineHtml: HtmlExtension = {
  enter: {
    underline(this: CompileContext) {
      this.tag('<u>')
    },
  },
  exit: {
    underline(this: CompileContext) {
      this.tag('</u>')
    },
  },
}
