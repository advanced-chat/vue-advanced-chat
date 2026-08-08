import { sanitizeUri } from 'micromark-util-sanitize-uri'
import type { CompileContext, HtmlExtension, Token } from 'micromark-util-types'

export interface GfmAutolinkLiteralOptions {
  target?: string
  rel?: string
}

export const gfmAutolinkLiteralHtml = (options?: GfmAutolinkLiteralOptions): HtmlExtension => {
  function anchorFromToken(this: CompileContext, token: Token, protocol?: string): void {
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

  return {
    exit: {
      literalAutolinkEmail(this: CompileContext, token: Token) {
        anchorFromToken.call(this, token, 'mailto:')
      },
      literalAutolinkHttp(this: CompileContext, token: Token) {
        anchorFromToken.call(this, token)
      },
      literalAutolinkWww(this: CompileContext, token: Token) {
        anchorFromToken.call(this, token, 'http://')
      },
    },
  }
}
