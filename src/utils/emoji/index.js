export const emojiRegex = /\p{Extended_Pictographic}/ug

export const hasEmoji = text => {
  return emojiRegex.test(text.toString())
}

export const extractEmojis = text => {
  return text.toString().match(emojiRegex)?.join('') || ''
}

export const containsOnlyEmojis = text => {
  const emojisOnly = extractEmojis(text)
  return emojisOnly.length === text.toString().length && hasEmoji(emojisOnly)
}
