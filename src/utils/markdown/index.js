import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import { underline, underlineHtml } from './underline'
import { usertag, usertagHtml } from './usertag'

const addLinkOptions = (html, { linkOptions }) => {
  return html.replaceAll('href', (match) => {
    return `target=${linkOptions.target} rel=${linkOptions.rel} ${match}`
  })
}

const removeLinks = (html) => {
  return html.replaceAll(/<a.*?>(.*?)<\/a>/g, '$1')
}

export default (text, { textFormatting }) => {
  if (textFormatting) {
    let gfmDisabled = []

    if (!textFormatting.linkify) {
      gfmDisabled = ['literalAutolink', 'literalAutolinkEmail']
    }

    const markdown = micromark(
      text.replaceAll('<usertag>', '<@').replaceAll('</usertag>', '>'),
      {
        extensions: [
          {
            ...gfm(),
            disable: { null: gfmDisabled }
          },
          underline,
          usertag
        ],
        htmlExtensions: [
          gfmHtml(),
          underlineHtml,
          usertagHtml(textFormatting.users)
        ]
      }
    )

    if (textFormatting.singleLine) {
      const element = document.createElement('div')

      element.innerHTML = markdown

      return [
        {
          types: [],
          value: element.innerText
        }
      ]
    }

    if (textFormatting.linkOptions.disabled) {
      return [
        {
          types: ['markdown'],
          value: removeLinks(markdown)
        }
      ]
    }

    return [
      {
        types: ['markdown'],
        value: addLinkOptions(markdown, textFormatting)
      }
    ]
  }

  return [
    {
      types: [],
      value: text
    }
  ]
}
