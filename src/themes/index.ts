/// <reference lib="dom" />
import light from './light.json' with { type: 'json' }
import dark from './dark.json' with { type: 'json' }

import { deepMerge } from '../utils/deep-merge.js'
import { onBeforeUnmount, onMounted, ref, type Ref, watch } from 'vue'

export type Theme =
  | 'light'
  | 'dark'
  | 'auto'
  | {
      base: 'light' | 'dark'
      overrides: Partial<Styles>
    }

export type Styles = {
  '--chat-color': string
  '--chat-color-button-clear': string
  '--chat-color-button': string
  '--chat-bg-color-button': string
  '--chat-bg-color-input': string
  '--chat-color-spinner': string
  '--chat-color-placeholder': string
  '--chat-color-caret': string
  '--chat-border-style': string
  '--chat-bg-scroll-icon': string
  '--chat-container-border': string
  '--chat-container-border-radius': string
  '--chat-container-box-shadow': string
  '--chat-header-bg-color': string
  '--chat-header-color-name': string
  '--chat-header-color-info': string
  '--chat-header-position': string
  '--chat-header-width': string
  '--chat-footer-bg-color': string
  '--chat-border-style-input': string
  '--chat-border-color-input-selected': string
  '--chat-footer-bg-color-reply': string
  '--chat-footer-bg-color-tag-active': string
  '--chat-footer-bg-color-tag': string
  '--chat-content-bg-color': string
  '--chat-sidemenu-bg-color': string
  '--chat-sidemenu-bg-color-hover': string
  '--chat-sidemenu-bg-color-active': string
  '--chat-sidemenu-color-active': string
  '--chat-sidemenu-border-color-search': string
  '--chat-dropdown-bg-color': string
  '--chat-dropdown-bg-color-hover': string
  '--chat-message-bg-color': string
  '--chat-message-bg-color-me': string
  '--chat-message-color-started': string
  '--chat-message-bg-color-deleted': string
  '--chat-message-bg-color-selected': string
  '--chat-message-color-deleted': string
  '--chat-message-color-username': string
  '--chat-message-color-timestamp': string
  '--chat-message-bg-color-date': string
  '--chat-message-color-date': string
  '--chat-message-bg-color-system': string
  '--chat-message-color-system': string
  '--chat-message-color': string
  '--chat-message-bg-color-media': string
  '--chat-message-bg-color-reply': string
  '--chat-message-color-reply-username': string
  '--chat-message-color-reply-content': string
  '--chat-message-color-tag': string
  '--chat-message-bg-color-image': string
  '--chat-message-color-new-messages': string
  '--chat-message-bg-color-scroll-counter': string
  '--chat-message-color-scroll-counter': string
  '--chat-message-bg-color-reaction': string
  '--chat-message-border-style-reaction': string
  '--chat-message-bg-color-reaction-hover': string
  '--chat-message-border-style-reaction-hover': string
  '--chat-message-color-reaction-counter': string
  '--chat-message-bg-color-reaction-me': string
  '--chat-message-border-style-reaction-me': string
  '--chat-message-bg-color-reaction-hover-me': string
  '--chat-message-border-style-reaction-hover-me': string
  '--chat-message-color-reaction-counter-me': string
  '--chat-message-bg-color-audio-record': string
  '--chat-message-bg-color-audio-line': string
  '--chat-message-bg-color-audio-progress': string
  '--chat-message-bg-color-audio-progress-selector': string
  '--chat-message-color-file-extension': string
  '--chat-markdown-bg': string
  '--chat-markdown-border': string
  '--chat-markdown-color': string
  '--chat-markdown-color-multi': string
  '--chat-room-color-username': string
  '--chat-room-color-message': string
  '--chat-room-color-timestamp': string
  '--chat-room-color-online': string
  '--chat-room-color-offline': string
  '--chat-room-bg-color-badge': string
  '--chat-room-color-badge': string
  '--chat-emoji-bg-color': string
  '--chat-icon-color-search': string
  '--chat-icon-color-add': string
  '--chat-icon-color-toggle': string
  '--chat-icon-color-menu': string
  '--chat-icon-color-close': string
  '--chat-icon-color-close-image': string
  '--chat-icon-color-file': string
  '--chat-icon-color-paperclip': string
  '--chat-icon-color-close-outline': string
  '--chat-icon-color-close-preview': string
  '--chat-icon-color-send': string
  '--chat-icon-color-send-disabled': string
  '--chat-icon-color-emoji': string
  '--chat-icon-color-emoji-reaction': string
  '--chat-icon-color-document': string
  '--chat-icon-color-pencil': string
  '--chat-icon-color-checkmark': string
  '--chat-icon-color-checkmark-seen': string
  '--chat-icon-color-eye': string
  '--chat-icon-color-dropdown-message': string
  '--chat-icon-bg-dropdown-message': string
  '--chat-icon-color-dropdown-room': string
  '--chat-icon-color-dropdown-scroll': string
  '--chat-icon-color-microphone': string
  '--chat-icon-color-audio-play': string
  '--chat-icon-color-audio-pause': string
  '--chat-icon-color-audio-cancel': string
  '--chat-icon-color-audio-confirm': string
  '--chat-message-color-failure': string
  '--chat-message-bg-color-failure': string
}

const prefersDark = (): boolean => {
  if (typeof window === 'undefined' || !window.matchMedia) return false

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const getThemeStyles = (theme: Theme): Styles => {
  if (typeof theme === 'object') {
    const baseStyles = theme.base === 'dark' ? dark : light

    const overrideStyles = theme.overrides || {}

    return deepMerge(baseStyles, overrideStyles)
  }

  const isDarkMode = (theme === 'auto' && prefersDark()) || theme === 'dark'

  return isDarkMode ? dark : light
}

/**
 * Reactive `Styles` ref that follows the active theme. When the theme
 * is `'auto'` it tracks `prefers-color-scheme` updates after mount.
 */
export const useThemeStyles = (theme: Ref<Theme | undefined>): Ref<Styles> => {
  const styles = ref<Styles>(getThemeStyles(theme.value || 'auto'))

  let mediaQuery: MediaQueryList | null = null
  const onMediaChange = () => {
    styles.value = getThemeStyles(theme.value || 'auto')
  }

  const subscribe = () => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', onMediaChange)
  }

  const unsubscribe = () => {
    if (!mediaQuery) return

    mediaQuery.removeEventListener('change', onMediaChange)
    mediaQuery = null
  }

  watch(
    theme,
    (next) => {
      styles.value = getThemeStyles(next || 'auto')

      unsubscribe()

      if (next === 'auto') {
        subscribe()
      }
    },
    { immediate: false },
  )

  onMounted(() => {
    if ((theme.value || 'auto') === 'auto') {
      subscribe()
    }
  })

  onBeforeUnmount(unsubscribe)

  return styles
}
