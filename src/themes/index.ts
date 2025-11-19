import light from './light.ts'
import dark from './dark.ts'

import type { Theme, Styles, ThemeOptions } from './types.ts'

export type { Theme, Styles }

export const baseThemeOptions: {
  light: ThemeOptions
  dark: ThemeOptions
} = {
  light,
  dark,
}

export const cssThemeVars = ({
  general,
  container,
  header,
  footer,
  sidemenu,
  content,
  dropdown,
  message,
  markdown,
  room,
  emoji,
  icons,
}: ThemeOptions) => {
  return {
    // general
    '--chat-color': general.color,
    '--chat-color-button-clear': general.colorButtonClear,
    '--chat-color-button': general.colorButton,
    '--chat-bg-color-button': general.backgroundColorButton,
    '--chat-bg-color-input': general.backgroundInput,
    '--chat-color-spinner': general.colorSpinner,
    '--chat-color-placeholder': general.colorPlaceholder,
    '--chat-color-caret': general.colorCaret,
    '--chat-border-style': general.borderStyle,
    '--chat-bg-scroll-icon': general.backgroundScrollIcon,

    // container
    '--chat-container-border': container.border,
    '--chat-container-border-radius': container.borderRadius,
    '--chat-container-box-shadow': container.boxShadow,

    // header
    '--chat-header-bg-color': header.background,
    '--chat-header-color-name': header.colorRoomName,
    '--chat-header-color-info': header.colorRoomInfo,
    '--chat-header-position': header.position,
    '--chat-header-width': header.width,

    // footer
    '--chat-footer-bg-color': footer.background,
    '--chat-border-style-input': footer.borderStyleInput,
    '--chat-border-color-input-selected': footer.borderInputSelected,
    '--chat-footer-bg-color-reply': footer.backgroundReply,
    '--chat-footer-bg-color-tag-active': footer.backgroundTagActive,
    '--chat-footer-bg-color-tag': footer.backgroundTag,

    // content
    '--chat-content-bg-color': content.background,

    // sidemenu
    '--chat-sidemenu-bg-color': sidemenu.background,
    '--chat-sidemenu-bg-color-hover': sidemenu.backgroundHover,
    '--chat-sidemenu-bg-color-active': sidemenu.backgroundActive,
    '--chat-sidemenu-color-active': sidemenu.colorActive,
    '--chat-sidemenu-border-color-search': sidemenu.borderColorSearch,

    // dropdown
    '--chat-dropdown-bg-color': dropdown.background,
    '--chat-dropdown-bg-color-hover': dropdown.backgroundHover,

    // message
    '--chat-message-bg-color': message.background,
    '--chat-message-bg-color-me': message.backgroundMe,
    '--chat-message-color-started': message.colorStarted,
    '--chat-message-bg-color-deleted': message.backgroundDeleted,
    '--chat-message-bg-color-selected': message.backgroundSelected,
    '--chat-message-color-deleted': message.colorDeleted,
    '--chat-message-color-username': message.colorUsername,
    '--chat-message-color-timestamp': message.colorTimestamp,
    '--chat-message-bg-color-date': message.backgroundDate,
    '--chat-message-color-date': message.colorDate,
    '--chat-message-bg-color-system': message.backgroundSystem,
    '--chat-message-color-system': message.colorSystem,
    '--chat-message-color': message.color,
    '--chat-message-bg-color-media': message.backgroundMedia,
    '--chat-message-bg-color-reply': message.backgroundReply,
    '--chat-message-color-reply-username': message.colorReplyUsername,
    '--chat-message-color-reply-content': message.colorReply,
    '--chat-message-color-tag': message.colorTag,
    '--chat-message-bg-color-image': message.backgroundImage,
    '--chat-message-color-new-messages': message.colorNewMessages,
    '--chat-message-bg-color-scroll-counter': message.backgroundScrollCounter,
    '--chat-message-color-scroll-counter': message.colorScrollCounter,
    '--chat-message-bg-color-reaction': message.backgroundReaction,
    '--chat-message-border-style-reaction': message.borderStyleReaction,
    '--chat-message-bg-color-reaction-hover': message.backgroundReactionHover,
    '--chat-message-border-style-reaction-hover': message.borderStyleReactionHover,
    '--chat-message-color-reaction-counter': message.colorReactionCounter,
    '--chat-message-bg-color-reaction-me': message.backgroundReactionMe,
    '--chat-message-border-style-reaction-me': message.borderStyleReactionMe,
    '--chat-message-bg-color-reaction-hover-me': message.backgroundReactionHoverMe,
    '--chat-message-border-style-reaction-hover-me': message.borderStyleReactionHoverMe,
    '--chat-message-color-reaction-counter-me': message.colorReactionCounterMe,
    '--chat-message-bg-color-audio-record': message.backgroundAudioRecord,
    '--chat-message-bg-color-audio-line': message.backgroundAudioLine,
    '--chat-message-bg-color-audio-progress': message.backgroundAudioProgress,
    '--chat-message-bg-color-audio-progress-selector': message.backgroundAudioProgressSelector,
    '--chat-message-color-file-extension': message.colorFileExtension,

    // markdown
    '--chat-markdown-bg': markdown.background,
    '--chat-markdown-border': markdown.border,
    '--chat-markdown-color': markdown.color,
    '--chat-markdown-color-multi': markdown.colorMulti,

    // room
    '--chat-room-color-username': room.colorUsername,
    '--chat-room-color-message': room.colorMessage,
    '--chat-room-color-timestamp': room.colorTimestamp,
    '--chat-room-color-online': room.colorStateOnline,
    '--chat-room-color-offline': room.colorStateOffline,
    '--chat-room-bg-color-badge': room.backgroundCounterBadge,
    '--chat-room-color-badge': room.colorCounterBadge,

    // emoji
    '--chat-emoji-bg-color': emoji.background,

    // icons
    '--chat-icon-color-search': icons.search,
    '--chat-icon-color-add': icons.add,
    '--chat-icon-color-toggle': icons.toggle,
    '--chat-icon-color-menu': icons.menu,
    '--chat-icon-color-close': icons.close,
    '--chat-icon-color-close-image': icons.closeImage,
    '--chat-icon-color-file': icons.file,
    '--chat-icon-color-paperclip': icons.paperclip,
    '--chat-icon-color-close-outline': icons.closeOutline,
    '--chat-icon-color-close-preview': icons.closePreview,
    '--chat-icon-color-send': icons.send,
    '--chat-icon-color-send-disabled': icons.sendDisabled,
    '--chat-icon-color-emoji': icons.emoji,
    '--chat-icon-color-emoji-reaction': icons.emojiReaction,
    '--chat-icon-color-document': icons.document,
    '--chat-icon-color-pencil': icons.pencil,
    '--chat-icon-color-checkmark': icons.checkmark,
    '--chat-icon-color-checkmark-seen': icons.checkmarkSeen,
    '--chat-icon-color-eye': icons.eye,
    '--chat-icon-color-dropdown-message': icons.dropdownMessage,
    '--chat-icon-bg-dropdown-message': icons.dropdownMessageBackground,
    '--chat-icon-color-dropdown-room': icons.dropdownRoom,
    '--chat-icon-color-dropdown-scroll': icons.dropdownScroll,
    '--chat-icon-color-microphone': icons.microphone,
    '--chat-icon-color-audio-play': icons.audioPlay,
    '--chat-icon-color-audio-pause': icons.audioPause,
    '--chat-icon-color-audio-cancel': icons.audioCancel,
    '--chat-icon-color-audio-confirm': icons.audioConfirm,
  }
}
