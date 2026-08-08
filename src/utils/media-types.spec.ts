import { describe, it, expect } from 'vitest'
import { isAudioFile, isImageFile, isVideoFile, isVisualMediaFile } from './media-types'

describe('media-types', () => {
  describe('isImageFile', () => {
    it('detects via MIME type', () => {
      expect(isImageFile({ type: 'image/png' })).toBe(true)
      expect(isImageFile({ type: 'image/jpeg' })).toBe(true)
      expect(isImageFile({ type: 'image/svg+xml' })).toBe(true)
    })

    it('detects via filename extension', () => {
      expect(isImageFile({ name: 'photo.png' })).toBe(true)
      expect(isImageFile({ name: 'photo.JPG' })).toBe(true)
    })

    it('rejects non-image input', () => {
      expect(isImageFile({ type: 'text/plain' })).toBe(false)
      expect(isImageFile({ name: 'doc.pdf' })).toBe(false)
      expect(isImageFile(null)).toBe(false)
      expect(isImageFile(undefined)).toBe(false)
      expect(isImageFile({})).toBe(false)
    })
  })

  describe('isVideoFile', () => {
    it('detects mp4 and webm', () => {
      expect(isVideoFile({ type: 'video/mp4' })).toBe(true)
      expect(isVideoFile({ type: 'video/webm' })).toBe(true)
      expect(isVideoFile({ name: 'clip.mp4' })).toBe(true)
    })

    it('detects quicktime via the explicit token', () => {
      expect(isVideoFile({ type: 'video/quicktime' })).toBe(true)
    })

    it('rejects audio and unrelated MIMEs', () => {
      expect(isVideoFile({ type: 'audio/mp3' })).toBe(false)
      expect(isVideoFile({ type: 'image/png' })).toBe(false)
    })
  })

  describe('isAudioFile', () => {
    it('detects mp3, wav, mpeg', () => {
      expect(isAudioFile({ type: 'audio/mpeg' })).toBe(true)
      expect(isAudioFile({ type: 'audio/wav' })).toBe(true)
      expect(isAudioFile({ name: 'voice-note.mp3' })).toBe(true)
    })

    it('rejects non-audio', () => {
      expect(isAudioFile({ type: 'video/mp4' })).toBe(false)
      expect(isAudioFile(null)).toBe(false)
    })
  })

  describe('isVisualMediaFile', () => {
    it('returns true for images and videos but not audio', () => {
      expect(isVisualMediaFile({ type: 'image/png' })).toBe(true)
      expect(isVisualMediaFile({ type: 'video/mp4' })).toBe(true)
      expect(isVisualMediaFile({ type: 'audio/mp3' })).toBe(false)
    })
  })

  it('handles MIME parameters like charset suffixes', () => {
    expect(isImageFile({ type: 'image/svg+xml; charset=utf-8' })).toBe(true)
  })
})
