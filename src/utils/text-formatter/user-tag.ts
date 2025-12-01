// @ts-nocheck

import type { Extension, HtmlExtension } from 'micromark-extension-gfm'

import { codes } from './codes.js'

import { findUserById } from '../../models'

const userTagTokenize = (effects, ok, nok) => {
  const inside = (code) => {
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

  const insideEscape = (code) => {
    if (code === codes.backslash || code === codes.greaterThan) {
      effects.consume(code)

      return inside
    }

    return inside(code)
  }

  const begin = (code) => {
    if (code === codes.atSign) {
      effects.consume(code)
      effects.exit('userTagMarker')
      effects.enter('userTagContent')

      return inside
    }

    return nok(code)
  }

  return (code) => {
    effects.enter('userTag')
    effects.enter('userTagMarker')
    effects.consume(code)

    return begin
  }
}

const userTagConstruct = { name: 'userTag', tokenize: userTagTokenize }

export const userTag: Extension = { text: { 60: userTagConstruct } } // 60 is the less than sign

export const userTagHtml: (users) => HtmlExtension = (users) => ({
  exit: {
    userTagContent(token) {
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
