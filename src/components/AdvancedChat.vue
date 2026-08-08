<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'

import Chat from '@/components/Chat.vue'
import Chats from '@/components/Chats.vue'
import Layout from '@/components/Layout.vue'
import Loader from '@/components/Loader.vue'

import { type Theme } from '../themes'
import type {
  Action,
  Chat as ChatModel,
  Message,
  MessageFile,
  User,
  UserReference,
} from '../models'
import type { ChatFileItem } from './ChatFile.vue'
import type { TextFormattingOptions } from '../utils/text-formatter'
import { useLocalizationStrings } from '../localization'

const strings = useLocalizationStrings()

export interface AdvancedChatProps {
  /** Outer container height as a CSS length. Defaults to `'600px'`. */
  height?: string
  /** Visual theme. Defaults to `'auto'`, which follows the user's OS preference. */
  theme?: Theme
  /** Identifies the viewer; required to render most UI. Defaults to `null`. */
  currentUser?: UserReference | null
  /** Chats shown in the left-hand list. */
  chats?: ChatModel[]
  /** Initially-active chat; the inner `Chat` switches to this when it changes. */
  chat?: ChatModel | null
  /** Messages for the active chat. */
  messages?: Message[]
  /** Shows the chats-list spinner while `true`. */
  loadingChats?: boolean
  /** Set to `true` once all chats have been delivered to disable further `fetch-more-chats`. */
  chatsLoaded?: boolean
  /** Shows the messages spinner while `true`. */
  loadingMessages?: boolean
  /** Set to `true` once all messages for the active chat have been delivered. */
  messagesLoaded?: boolean
  /** Items rendered in the chat-header overflow menu. */
  headerActions?: Action[]
  /** Items rendered in each message's actions menu. */
  messageActions?: Action[]
  /** Items rendered in each chat-list item's actions menu. */
  chatActions?: Action[]
  /**
   * Bulk-action items rendered in the message-selection toolbar. Pass
   * non-empty to enable selection mode; pass empty (the default) to
   * disable it. Replaces the prior `messageSelectionActions` prop.
   */
  selectionActions?: Action[]
  /** Renders the chats sidebar when `true`. Defaults to `true`. */
  showChats?: boolean
  /** Shows the search input in the chats sidebar. Defaults to `true`. */
  showSearch?: boolean
  /** Shows the "add chat" button in the chats sidebar. Defaults to `true`. */
  showAddChat?: boolean
  /** Shows the file-attachment button in the composer. Defaults to `true`. */
  showFiles?: boolean
  /** Shows the emoji-picker button in the composer. Defaults to `true`. */
  showEmojis?: boolean
  /** Renders the composer footer. Defaults to `true`. */
  showFooter?: boolean
  /** Shows the send-icon button in the composer. Defaults to `true`. */
  showSendIcon?: boolean
  /** Shows the inline emoji-reaction picker on each message. Defaults to `true`. */
  showReactionEmojis?: boolean
  /** Renders the "new messages" divider above the first unread message. Defaults to `true`. */
  showNewMessagesDivider?: boolean
  /**
   * Text-formatting applied to every message body in the active chat.
   */
  textFormatting?: Partial<TextFormattingOptions>
  /** `accept` attribute forwarded to the file input. Defaults to `'*'`. */
  accept?: string
  /** Allows selecting multiple files in the file picker. Defaults to `true`. */
  multiple?: boolean
  /** `capture` attribute forwarded to the file input (mobile camera/mic). */
  capture?: '' | 'user' | 'environment'
  /** Max files in the composer at once. `0` / unset disables. */
  maxFiles?: number
  /** Max bytes per file. `0` / unset disables. */
  maxFileSize?: number
  /**
   * Where to render the typing-users indicator. See `Chat`'s prop for
   * full semantics. Default `'header'`.
   */
  typingIndicatorPosition?: 'header' | 'composer' | 'both' | 'none'
  /**
   * Auto-scroll policy for the message list. See `Chat`'s prop for
   * the per-leg semantics. All legs default `true`.
   */
  autoScroll?: {
    onMount?: boolean
    onChatSwitch?: boolean
    onSend?: boolean
    onReceive?: boolean
  }
  /**
   * When `true`, `search-chat` still fires on every keystroke but the
   * built-in local filter is suppressed — the host renders server-driven
   * results.
   */
  customSearchEnabled?: boolean
  /** When `true`, the header becomes clickable and emits `show-chat-info`. */
  chatInfoEnabled?: boolean
  /** Operational state shown by the component. Offline states preserve the chat UI. */
  status?:
    | 'ready'
    | 'loading'
    | 'empty'
    | 'error'
    | 'offline'
    | 'reconnecting'
    | 'permission-denied'
  /** Optional host-provided copy for the operational state. */
  statusMessage?: string
  /** Optional label for the error-state retry action. */
  retryLabel?: string
  /** Disables the composer while preserving history and navigation. */
  composerDisabled?: boolean
}

export interface AdvancedChatEvents {
  /**
   * Fires on each keystroke in the chats search input. Always emitted;
   * pair with `customSearchEnabled` to opt out of the built-in local
   * filter and drive results from your backend.
   */
  (e: 'search-chat', query: string): void

  /** Fires when the "add chat" button is clicked. */
  (e: 'add-chat'): void

  /** Fires when the chats list scrolls near the bottom and more chats should be paginated in. */
  (e: 'fetch-more-chats'): void

  /** Fires when the messages list scrolls near the top and more messages should be paginated in. */
  (e: 'fetch-messages'): void

  /** Fires when the user selects a chat from the list. */
  (e: 'open-chat', chat: ChatModel): void

  /** Fires when the chat header is clicked while `chatInfoEnabled` is `true`. */
  (e: 'show-chat-info', chat: ChatModel): void

  /** Fires when an item in the chat-header menu is selected. */
  (e: 'menu-action-handler', payload: { chat: ChatModel; action: Action }): void

  /** Fires when an item in a message's actions menu is selected. */
  (e: 'message-action-handler', payload: { action: Action; message: Message }): void

  /** Fires when a bulk-selection action is invoked, with the currently-selected messages. */
  (
    e: 'message-selection-action-handler',
    payload: { chat: ChatModel; action: Action; messages: Message[] },
  ): void

  /** Fires when an item in a chat-list item's actions menu is selected. */
  (e: 'chat-action-handler', payload: { chat: ChatModel; action: Action }): void

  /** Fires when the user exits message-selection mode. */
  (e: 'cancel-message-selection'): void

  /** Fires when a message file is clicked; `action` is `'preview'` for media and `'download'` for other files. */
  (e: 'open-file', payload: { file: MessageFile; action: 'preview' | 'download' }): void

  /** Fires when the user clicks a failed message to retry sending. */
  (e: 'open-failed-message', message: Message): void

  /** Fires when the viewer adds or removes a reaction; the host should toggle the emoji on the message. */
  (e: 'send-message-reaction', payload: { emoji: string; message: Message }): void

  /** Fires when an `@user` tag in a rendered message is clicked. */
  (e: 'click-user-tag', user: User): void

  /** Fires (debounced) as the viewer types in the composer; emit typing presence upstream. */
  (e: 'typing-message', value: string): void

  /** Fires when the viewer sends a new message. */
  (
    e: 'send-message',
    payload: {
      content: string
      files: ChatFileItem[]
      mentionedUsers: User[]
      reply?: Message | null
    },
  ): void

  /** Fires when the viewer commits an edit to an existing message. */
  (
    e: 'edit-message',
    payload: {
      messageId: Message['id']
      content: string
      files: ChatFileItem[]
      mentionedUsers: User[]
    },
  ): void

  /**
   * Re-emitted from `Chat`/`ChatFooter` when a pending file is rejected
   * by a configured `maxFiles` / `maxFileSize` limit.
   */
  (e: 'invalid-file', payload: { file: File; reason: 'size' | 'count' }): void

  /** Fires when the user activates the retry action in an error state. */
  (e: 'retry'): void
}

const props = withDefaults(defineProps<AdvancedChatProps>(), {
  theme: 'auto',
  currentUser: null,
  chats: () => [],
  chat: null,
  messages: () => [],
  loadingChats: false,
  chatsLoaded: false,
  loadingMessages: false,
  messagesLoaded: false,
  headerActions: () => [],
  messageActions: () => [],
  chatActions: () => [],
  selectionActions: () => [],
  showChats: true,
  showSearch: true,
  showAddChat: true,
  showFiles: true,
  showEmojis: true,
  showFooter: true,
  showSendIcon: true,
  showReactionEmojis: true,
  showNewMessagesDivider: true,
  textFormatting: () => ({}),
  accept: '*',
  multiple: true,
  capture: '',
  maxFiles: 0,
  maxFileSize: 0,
  typingIndicatorPosition: 'header',
  autoScroll: () => ({ onMount: true, onChatSwitch: true, onSend: true, onReceive: true }),
  customSearchEnabled: false,
  chatInfoEnabled: false,
  status: 'ready',
  statusMessage: '',
  retryLabel: '',
  composerDisabled: false,
  height: '600px',
})

const emit = defineEmits<AdvancedChatEvents>()

const activeChat = ref<ChatModel | null>(props.chat)

watch(
  () => props.chat,
  (chat) => {
    activeChat.value = chat
  },
  { immediate: true },
)

watch(
  () => props.chats,
  (chats) => {
    if (!activeChat.value && chats.length) {
      activeChat.value = chats[0] || null
    }
  },
  { immediate: true },
)

const container = useTemplateRef<HTMLElement>('container')
const showChatList = ref(true)
const isMobile = ref(false)
let resizeObserver: ResizeObserver | null = null

const updateLayout = (width: number) => {
  const nextMobile = width <= 768

  if (nextMobile && !isMobile.value) showChatList.value = true
  isMobile.value = nextMobile
}

onMounted(() => {
  const element = container.value
  if (!element) return

  updateLayout(element.clientWidth)
  if (typeof ResizeObserver === 'undefined') return

  resizeObserver = new ResizeObserver(([entry]) => {
    if (entry) updateLayout(entry.contentRect.width)
  })
  resizeObserver.observe(element)
})

onBeforeUnmount(() => resizeObserver?.disconnect())

const chatMessages = computed(() => props.messages)

const onShowChatInfo = () => {
  if (!activeChat.value) return

  emit('show-chat-info', activeChat.value)
}

const onOpenChat = (chat: ChatModel) => {
  activeChat.value = chat
  if (isMobile.value) showChatList.value = false
  emit('open-chat', chat)
}

const stateMessage = computed(() => {
  if (props.statusMessage) return props.statusMessage

  return {
    loading: strings['chat.state.loading'],
    empty: strings['chat.state.empty'],
    error: strings['chat.state.error'],
    offline: strings['chat.state.offline'],
    reconnecting: strings['chat.state.reconnecting'],
    'permission-denied': strings['chat.state.permission-denied'],
    ready: '',
  }[props.status]
})

const showBlockingState = computed(() =>
  ['loading', 'empty', 'error', 'permission-denied'].includes(props.status),
)
</script>

<template>
  <Layout :height="height" :theme="theme">
    <div
      ref="container"
      class="acc-chat-root"
      :data-status="status"
      :aria-busy="status === 'loading'"
    >
      <div
        v-if="status === 'offline' || status === 'reconnecting'"
        class="acc-status-banner"
        role="status"
        aria-live="polite"
      >
        {{ stateMessage }}
      </div>

      <div
        v-show="showBlockingState"
        class="acc-state-panel"
        :role="status === 'error' ? 'alert' : 'status'"
      >
        <Loader :show="status === 'loading'" />
        <p v-if="status !== 'loading'">{{ stateMessage }}</p>
        <button v-if="status === 'error'" type="button" @click="emit('retry')">
          {{ retryLabel || strings['chat.state.retry'] }}
        </button>
      </div>

      <div v-show="!showBlockingState" class="acc-chat-container">
        <Chats
          v-if="currentUser"
          v-show="showChats && showChatList"
          :current-user="currentUser"
          :chats="chats"
          :chat="activeChat || undefined"
          :loading-chats="loadingChats"
          :chats-loaded="chatsLoaded"
          :show-search="showSearch"
          :show-add-chat="showAddChat"
          :chat-actions="chatActions"
          :custom-search-enabled="customSearchEnabled"
          :is-mobile="isMobile"
          @search-chat="emit('search-chat', $event)"
          @add-chat="emit('add-chat')"
          @fetch-more-chats="emit('fetch-more-chats')"
          @open-chat="onOpenChat"
          @chat-action-handler="emit('chat-action-handler', $event)"
        />

        <Chat
          v-show="!isMobile || !showChats || !showChatList"
          :current-user="currentUser"
          :chat="activeChat"
          :messages="chatMessages"
          :loading-messages="loadingMessages"
          :messages-loaded="messagesLoaded"
          :show-chat-list="showChatList"
          :header-actions="headerActions"
          :message-actions="messageActions"
          :selection-actions="selectionActions"
          :show-files="showFiles"
          :show-emojis="showEmojis"
          :show-footer="showFooter"
          :show-send-icon="showSendIcon"
          :show-reaction-emojis="showReactionEmojis"
          :show-new-messages-divider="showNewMessagesDivider"
          :text-formatting="textFormatting"
          :accept="accept"
          :multiple="multiple"
          :capture="capture"
          :max-files="maxFiles"
          :max-file-size="maxFileSize"
          :typing-indicator-position="typingIndicatorPosition"
          :auto-scroll="autoScroll"
          :chat-info-enabled="chatInfoEnabled"
          :composer-disabled="composerDisabled"
          :standalone="!showChats"
          :is-mobile="isMobile"
          @toggle-chat-list="showChatList = !showChatList"
          @show-chat-info="onShowChatInfo"
          @menu-action-handler="emit('menu-action-handler', $event)"
          @message-action-handler="emit('message-action-handler', $event)"
          @message-selection-action-handler="emit('message-selection-action-handler', $event)"
          @cancel-message-selection="emit('cancel-message-selection')"
          @open-file="emit('open-file', $event)"
          @open-failed-message="emit('open-failed-message', $event)"
          @send-message-reaction="emit('send-message-reaction', $event)"
          @click-user-tag="emit('click-user-tag', $event)"
          @typing-message="emit('typing-message', $event)"
          @send-message="emit('send-message', $event)"
          @edit-message="emit('edit-message', $event)"
          @fetch-messages="emit('fetch-messages')"
          @invalid-file="emit('invalid-file', $event)"
        />
      </div>
    </div>
  </Layout>
</template>

<style scoped lang="scss">
.acc-chat-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  container-type: inline-size;
  overflow: hidden;
  border-radius: inherit;
}

.acc-chat-container {
  min-height: 0;
  flex: 1;
  height: 100%;
  display: flex;

  input {
    min-width: 10px;
  }

  textarea,
  input[type='text'],
  input[type='search'] {
    -webkit-appearance: none;
  }
}

.acc-status-banner {
  flex: 0 0 auto;
  padding: 9px 16px;
  border-bottom: var(--chat-border-style);
  background: var(--chat-message-bg-color-date);
  color: var(--chat-message-color);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-align: center;
}

.acc-state-panel {
  display: grid;
  flex: 1;
  place-content: center;
  gap: 16px;
  padding: 24px;
  background: var(--chat-content-bg-color);
  color: var(--chat-message-color);
  text-align: center;

  p {
    max-width: 360px;
    margin: 0;
    color: var(--chat-message-color-started);
    font-size: 15px;
  }

  button {
    justify-self: center;
    padding: 10px 18px;
    border: 0;
    border-radius: 10px;
    background: var(--chat-bg-color-button);
    color: var(--chat-color-button);
    cursor: pointer;
    font-weight: 700;
    box-shadow: 0 8px 20px color-mix(in srgb, var(--chat-bg-color-button) 28%, transparent);

    &:hover {
      filter: brightness(1.08);
    }

    &:focus-visible {
      outline: 2px solid var(--chat-border-color-input-selected);
      outline-offset: 3px;
    }
  }
}
</style>
