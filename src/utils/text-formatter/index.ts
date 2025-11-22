import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import { underline, underlineHtml } from './underline.js'

export interface LinkOptions {
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
}

export interface TextFormattingOptions {
  markdown?: boolean
  singleLine?: boolean
  linkify?: boolean
  linkOptions?: LinkOptions
}

export interface FormattedText {
  value: string
  markdown?: boolean
  singleLine?: boolean
}

export const formatText = (
  text: string,
  { markdown, singleLine, linkify }: TextFormattingOptions,
): FormattedText => {
  let parsed = text

  if (markdown) {
    let gfmDisabled: string[] = []

    if (!linkify) {
      gfmDisabled = ['literalAutolink', 'literalAutolinkEmail']
    }

    parsed = micromark(text, {
      extensions: [
        {
          ...gfm(),
          disable: { null: gfmDisabled },
        },
        underline,
      ],
      htmlExtensions: [gfmHtml(), underlineHtml],
    })
  }

  if (singleLine) {
    const element = document.createElement('div')

    element.innerHTML = parsed

    parsed = element.innerText
  }

  return {
    value: parsed,
    markdown: markdown,
    singleLine: singleLine,
  }
}
