import type {
  CompileContext,
  Code,
  Effects,
  Extension,
  HtmlExtension,
  State,
  Token,
} from 'micromark-util-types'

import { codes } from './codes.ts'

import { findUserById } from '../../models'
import type { User } from '../../models/user'

const userTagTokenize = (effects: Effects, ok: State, nok: State): State => {
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

    if (code === codes.greaterThan) {
      effects.exit('userTagContent')
      effects.enter('userTagMarker')
      effects.consume(code)
      effects.exit('userTagMarker')
      effects.exit('userTag')
      return ok
    }

    effects.consume(code)
    return inside
  }

  const insideEscape: State = (code: Code) => {
    if (code === codes.backslash || code === codes.greaterThan) {
      effects.consume(code)
      return inside
    }
    return inside(code)
  }

  const begin: State = (code: Code) => {
    if (code === codes.atSign) {
      effects.consume(code)
      effects.exit('userTagMarker')
      effects.enter('userTagContent')
      return inside
    }
    return nok(code)
  }

  return (code: Code) => {
    effects.enter('userTag')
    effects.enter('userTagMarker')
    effects.consume(code)
    return begin
  }
}

const userTagConstruct = { name: 'userTag', tokenize: userTagTokenize }

export const userTag: Extension = { text: { 60: userTagConstruct } } // 60 is the less than sign

export const userTagHtml = (users: User[]): HtmlExtension => ({
  exit: {
    userTagContent(this: CompileContext, token: Token) {
      const userId = this.sliceSerialize(token)
      const user = findUserById(users, userId)

      if (!user) {
        this.raw(this.encode(`<@${userId}>`))
        return
      }

      this.tag(`<span class="vac-text-tag" data-user-id="${userId}">`)
      this.raw(`@${this.encode(user.name || userId)}`)
      this.tag('</span>')
    },
  },
})
