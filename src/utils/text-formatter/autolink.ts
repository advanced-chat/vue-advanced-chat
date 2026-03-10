// @ts-nocheck

import { sanitizeUri } from 'micromark-util-sanitize-uri'
import type { HtmlExtension, Token } from 'micromark-util-types'

export const gfmAutolinkLiteralHtml: (options?: {
  target?: string
  rel?: string
}) => HtmlExtension = (options) => {
  function anchorFromToken(this: unknown, token: Token, protocol?: string) {
    const url = this.sliceSerialize(token)

    this.tag(
      '<a href="' +
        sanitizeUri((protocol || '') + url) +
        (options?.target ? `" target="${options.target}` : '') +
        (options?.rel ? `" rel="${options.rel}` : '') +
        '">',
    )

    this.raw(this.encode(url))

    this.tag('</a>')
  }

  function literalAutolinkEmail(this: unknown, token: Token) {
    anchorFromToken.call(this, token, 'mailto:')
  }

  function literalAutolinkWww(this: unknown, token: Token) {
    anchorFromToken.call(this, token, 'http://')
  }

  function literalAutolinkHttp(this: unknown, token: Token) {
    anchorFromToken.call(this, token)
  }

  return {
    exit: {
      literalAutolinkEmail(token: Token) {
        literalAutolinkEmail.call(this, token)
      },
      literalAutolinkHttp(token: Token) {
        literalAutolinkHttp.call(this, token)
      },
      literalAutolinkWww(token: Token) {
        literalAutolinkWww.call(this, token)
      },
    },
  }
}
