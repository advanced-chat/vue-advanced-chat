export const IMAGE_TYPES = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'] as const
export const VIDEO_TYPES = ['mp4', 'video/ogg', 'webm', 'quicktime'] as const
export const AUDIO_TYPES = ['mp3', 'audio/ogg', 'wav', 'mpeg'] as const

export type MediaFile = {
  type?: string
  name?: string
}

const getMimeAndExtension = (file: MediaFile) => {
  const mime = (file.type ?? '').toLowerCase().trim()

  const name = file.name ?? ''

  const ext = name && name.includes('.') ? (name.toLowerCase().split('.').pop() ?? '') : ''

  return { mime, ext }
}

const checkMediaType = (types: readonly string[], file?: MediaFile | null): boolean => {
  if (!file) return false

  const { mime, ext } = getMimeAndExtension(file)

  if (!mime && !ext) return false

  return types.some((rawToken) => {
    const token = rawToken.toLowerCase()

    if (token.includes('/')) {
      if (mime === token) return true

      if (mime.startsWith(token + ';')) return true
    } else {
      if (mime.endsWith('/' + token)) return true

      if (token === 'quicktime' && mime.endsWith('/quicktime')) return true

      if (ext === token) return true

      if (mime.includes(token)) return true
    }

    return false
  })
}

export const isImageFile = (file?: MediaFile | null): boolean => checkMediaType(IMAGE_TYPES, file)

export const isVideoFile = (file?: MediaFile | null): boolean => checkMediaType(VIDEO_TYPES, file)

export const isVisualMediaFile = (file?: MediaFile | null): boolean =>
  isImageFile(file) || isVideoFile(file)

export const isAudioFile = (file?: MediaFile | null): boolean => checkMediaType(AUDIO_TYPES, file)
