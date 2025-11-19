import type { DeepPartial } from '@/utils/index.ts'

type Color = Style

type Style = string

interface GeneralTheme {
  color: Color
  colorButtonClear: Color
  colorButton: Color
  backgroundColorButton: Color
  backgroundInput: Color
  colorPlaceholder: Color
  colorCaret: Color
  colorSpinner: Color
  borderStyle: Style
  backgroundScrollIcon: Color
}

interface ContainerTheme {
  border: Style
  borderRadius: Style
  boxShadow: Style
}

interface HeaderTheme {
  background: Color
  colorRoomName: Color
  colorRoomInfo: Color
  position: Style
  width: Style
}

interface FooterTheme {
  background: Color
  borderStyleInput: Style
  borderInputSelected: Color
  backgroundReply: Color
  backgroundTagActive: Color
  backgroundTag: Color
}

interface ContentTheme {
  background: Color
}

interface SidemenuTheme {
  background: Color
  backgroundHover: Color
  backgroundActive: Color
  colorActive: Color
  borderColorSearch: Color
}

interface DropdownTheme {
  background: Color
  backgroundHover: Color
}

interface MessageTheme {
  background: Color
  backgroundMe: Color
  color: Color
  colorStarted: Color
  backgroundDeleted: Color
  backgroundSelected: Color
  colorDeleted: Color
  colorUsername: Color
  colorTimestamp: Color
  backgroundDate: Color
  colorDate: Color
  backgroundSystem: Color
  colorSystem: Color
  backgroundMedia: Color
  backgroundReply: Color
  colorReplyUsername: Color
  colorReply: Color
  colorTag: Color
  backgroundImage: Color
  colorNewMessages: Color
  backgroundScrollCounter: Color
  colorScrollCounter: Color
  backgroundReaction: Color
  borderStyleReaction: Style
  backgroundReactionHover: Color
  borderStyleReactionHover: Style
  colorReactionCounter: Color
  backgroundReactionMe: Color
  borderStyleReactionMe: Style
  backgroundReactionHoverMe: Color
  borderStyleReactionHoverMe: Style
  colorReactionCounterMe: Color
  backgroundAudioRecord: Color
  backgroundAudioLine: Color
  backgroundAudioProgress: Color
  backgroundAudioProgressSelector: Color
  colorFileExtension: Color
}

interface MarkdownTheme {
  background: Color
  border: Color
  color: Color
  colorMulti: Color
}

interface RoomTheme {
  colorUsername: Color
  colorMessage: Color
  colorTimestamp: Color
  colorStateOnline: Color
  colorStateOffline: Color
  backgroundCounterBadge: Color
  colorCounterBadge: Color
}

interface EmojiTheme {
  background: Color
}

interface IconsTheme {
  search: Color
  add: Color
  toggle: Color
  menu: Color
  close: Color
  closeImage: Color
  file: Color
  paperclip: Color
  closeOutline: Color
  closePreview: Color
  send: Color
  sendDisabled: Color
  emoji: Color
  emojiReaction: Color
  document: Color
  pencil: Color
  checkmark: Color
  checkmarkSeen: Color
  eye: Color
  dropdownMessage: Color
  dropdownMessageBackground: Color
  dropdownRoom: Color
  dropdownScroll: Color
  microphone: Color
  audioPlay: Color
  audioPause: Color
  audioCancel: Color
  audioConfirm: Color
}

export interface ThemeOptions {
  general: GeneralTheme
  container: ContainerTheme
  header: HeaderTheme
  footer: FooterTheme
  content: ContentTheme
  sidemenu: SidemenuTheme
  dropdown: DropdownTheme
  message: MessageTheme
  markdown: MarkdownTheme
  room: RoomTheme
  emoji: EmojiTheme
  icons: IconsTheme
}

export type Theme = 'light' | 'dark' | 'auto'
export type Styles = DeepPartial<ThemeOptions>
