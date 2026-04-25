import './assets/style.css'

import AdvancedChatPlugin from './plugin/index.ts'

import AdvancedChat from '@/components/AdvancedChat.vue'
import AudioControl from '@/components/AudioControl.vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import AutocompleteMenu from '@/components/AutocompleteMenu.vue'
import Chat from '@/components/Chat.vue'
import ChatEmojis from '@/components/ChatEmojis.vue'
import ChatFile from '@/components/ChatFile.vue'
import ChatFiles from '@/components/ChatFiles.vue'
import ChatFooter from '@/components/ChatFooter.vue'
import ChatHeader from '@/components/ChatHeader.vue'
import ChatMessage from '@/components/ChatMessage.vue'
import Chats from '@/components/Chats.vue'
import ChatsItem from '@/components/ChatsItem.vue'
import ChatsSearch from '@/components/ChatsSearch.vue'
import ChatUserTag from '@/components/ChatUserTag.vue'
import EmojiPicker from '@/components/EmojiPicker.vue'
import Layout from '@/components/Layout.vue'
import Loader from '@/components/Loader.vue'
import MediaPreview from '@/components/MediaPreview.vue'
import Message from '@/components/Message.vue'
import MessageActions from '@/components/MessageActions.vue'
import MessageFile from '@/components/MessageFile.vue'
import MessageFiles from '@/components/MessageFiles.vue'
import MessageReactions from '@/components/MessageReactions.vue'
import MessageReply from '@/components/MessageReply.vue'
import MessageTemplate from '@/components/MessageTemplate.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import SvgIcon from '@/components/SvgIcon.vue'

export {
  AdvancedChatPlugin,
  AdvancedChat,
  AudioControl,
  AudioPlayer,
  AutocompleteMenu,
  Chat,
  ChatEmojis,
  ChatFile,
  ChatFiles,
  ChatFooter,
  ChatHeader,
  ChatMessage,
  Chats,
  ChatsItem,
  ChatsSearch,
  ChatUserTag,
  EmojiPicker,
  Layout,
  Loader,
  MediaPreview,
  Message,
  MessageActions,
  MessageFile,
  MessageFiles,
  MessageReactions,
  MessageReply,
  MessageTemplate,
  ProgressBar,
  SvgIcon,
}

// Domain models
export type {
  Action,
  Chat as ChatModel,
  ChatReference,
  Id,
  Message as MessageModel,
  MessageFile as MessageFileModel,
  MessageReference,
  MessageStatus,
  MessageSummary,
  User,
  UserReference,
} from './models'
export { findUserById, typingUsersString } from './models'

// Action constants — built-in action `name` values that `Chat` recognizes
// internally (in addition to emitting `message-action-handler`).
export { REPLY_ACTION, EDIT_ACTION } from './components/actions'
export type { BuiltInActionName } from './components/actions'

// Theme primitives
export type { Styles, Theme } from './themes'
export { getThemeStyles, useThemeStyles } from './themes'

// Localization primitives
export type { Localization, Strings } from './localization'
export { getLocalizationStrings, useLocalizationStrings } from './localization'

// Per-component prop / event interfaces
export type { AdvancedChatProps, AdvancedChatEvents } from './components/AdvancedChat.vue'
export type { AudioControlProps, AudioControlEvents } from './components/AudioControl.vue'
export type { AudioPlayerProps, AudioPlayerEvents } from './components/AudioPlayer.vue'
export type {
  AutocompleteMenuProps,
  AutocompleteMenuEvents,
} from './components/AutocompleteMenu.vue'
export type { ChatProps, ChatEvents } from './components/Chat.vue'
export type { ChatEmojisProps, ChatEmojisEvents } from './components/ChatEmojis.vue'
export type { ChatFileProps, ChatFileEvents, ChatFileItem } from './components/ChatFile.vue'
export type { ChatFilesProps, ChatFilesEvents } from './components/ChatFiles.vue'
export type {
  ChatFooterProps,
  ChatFooterEvents,
  InvalidFileReason,
} from './components/ChatFooter.vue'
export type { ChatHeaderProps, ChatHeaderEvents } from './components/ChatHeader.vue'
export type { ChatMessageProps, ChatMessageEvents } from './components/ChatMessage.vue'
export type { ChatsProps, ChatsEvents } from './components/Chats.vue'
export type { ChatsItemProps, ChatsItemEvents } from './components/ChatsItem.vue'
export type { ChatsSearchProps } from './components/ChatsSearch.vue'
export type { ChatUserTagProps, ChatUserTagEvents } from './components/ChatUserTag.vue'
export type { EmojiPickerProps } from './components/EmojiPicker.vue'
export type { LayoutProps } from './components/Layout.vue'
export type { LoaderProps } from './components/Loader.vue'
export type { MediaPreviewProps, MediaPreviewEvents } from './components/MediaPreview.vue'
export type { MessageProps, MessageEvents } from './components/Message.vue'
export type { MessageActionsProps, MessageActionsEvents } from './components/MessageActions.vue'
export type { MessageFileProps, MessageFileEvents } from './components/MessageFile.vue'
export type { MessageFilesProps, MessageFilesEvents } from './components/MessageFiles.vue'
export type {
  MessageReactionsProps,
  MessageReactionsEvents,
} from './components/MessageReactions.vue'
export type { MessageReplyProps } from './components/MessageReply.vue'
export type { MessageTemplateProps, MessageTemplateEvents } from './components/MessageTemplate.vue'
export type { ProgressBarProps } from './components/ProgressBar.vue'
export type { SvgIconProps } from './components/SvgIcon.vue'

// Plugin options
export type { AdvancedChatOptions, AdvancedChatPlugin as AdvancedChatPluginType } from './plugin'

// Text formatter
export type {
  FormattedText,
  LinkOptions,
  TextFormattingBindings,
  TextFormattingOptions,
} from './utils/text-formatter'
export { formatText } from './utils/text-formatter'

// Composables — share the state machines that power the built-in
// components so consumers can build custom surfaces without re-deriving
// the autocomplete / selection / pagination logic.
export {
  useAutocomplete,
  useMessageSelection,
  useReplyEdit,
  useInfiniteScroll,
  useLocalSearch,
} from './composables'
export type {
  UseAutocompleteOptions,
  UseAutocompleteReturn,
  UseMessageSelectionOptions,
  UseMessageSelectionReturn,
  UseReplyEditOptions,
  UseReplyEditReturn,
  UseInfiniteScrollOptions,
  UseInfiniteScrollReturn,
  UseLocalSearchOptions,
  UseLocalSearchReturn,
} from './composables'
