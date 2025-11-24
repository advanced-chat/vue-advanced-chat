import { micromark } from 'micromark'
import { gfm } from 'micromark-extension-gfm'

import { combineHtmlExtensions } from 'micromark-util-combine-extensions'
import { gfmFootnoteHtml } from 'micromark-extension-gfm-footnote'
import { gfmStrikethroughHtml } from 'micromark-extension-gfm-strikethrough'
import { gfmTableHtml } from 'micromark-extension-gfm-table'
import { gfmTagfilterHtml } from 'micromark-extension-gfm-tagfilter'
import { gfmTaskListItemHtml } from 'micromark-extension-gfm-task-list-item'

import { gfmAutolinkLiteralHtml } from './autolink.js'

import { underline, underlineHtml } from './underline.js'
import { userTag, userTagHtml } from './user-tag.js'

import type { User } from '../../models/index.ts'

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

export interface TextFormattingBindings {
  users?: Array<User>
}

export interface FormattedText {
  value: string
  markdown?: boolean
  singleLine?: boolean
}

export const formatText = (
  text: string,
  { markdown, singleLine, linkify, linkOptions }: TextFormattingOptions,
  { users }: TextFormattingBindings = {},
): FormattedText => {
  let parsed = text

  if (markdown) {
    let gfmDisabled: string[] = []

    if (!linkify) {
      gfmDisabled = ['literalAutolink', 'literalAutolinkEmail']
    }

    function gfmHtml() {
      return combineHtmlExtensions([
        gfmAutolinkLiteralHtml(linkOptions),
        gfmFootnoteHtml(),
        gfmStrikethroughHtml(),
        gfmTableHtml(),
        gfmTagfilterHtml(),
        gfmTaskListItemHtml(),
      ])
    }

    parsed = micromark(text, {
      extensions: [
        {
          ...gfm(),
          disable: { null: gfmDisabled },
        },
        underline,
        userTag,
      ],
      htmlExtensions: [gfmHtml(), underlineHtml, userTagHtml(users || [])],
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
