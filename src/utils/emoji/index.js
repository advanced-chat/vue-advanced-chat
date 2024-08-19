export const emojiRegex = /\p{Extended_Pictographic}/ug

export const hasEmoji = text => {
  return emojiRegex.test(text.toString())
}

export const extractEmojis = text => {
  return text.toString().match(emojiRegex)?.join('') || ''
}

export const containsOnlyEmojis = text => {
  const emojisOnly = extractEmojis(text)
  return emojiCount(text) < text.toString().length && hasEmoji(emojisOnly)
}

export const emojiCount = text => {
  return [...new Intl.Segmenter().segment(text)].length
}
