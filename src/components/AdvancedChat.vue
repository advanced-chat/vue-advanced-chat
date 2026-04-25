<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import Chat from '@/components/Chat.vue'
import Chats from '@/components/Chats.vue'
import Layout from '@/components/Layout.vue'

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

export interface AdvancedChatProps {
  height?: string
  theme?: Theme
  currentUser?: UserReference | null
  chats?: ChatModel[]
  chat?: ChatModel | null
  messages?: Message[]
  loadingChats?: boolean
  chatsLoaded?: boolean
  loadingMessages?: boolean
  messagesLoaded?: boolean
  headerActions?: Action[]
  messageActions?: Action[]
  chatActions?: Action[]
  /**
   * Bulk-action items rendered in the message-selection toolbar. Pass
   * non-empty to enable selection mode; pass empty (the default) to
   * disable it. Replaces the prior `messageSelectionActions` prop.
   */
  selectionActions?: Action[]
  showChats?: boolean
  showSearch?: boolean
  showAddChat?: boolean
  showFiles?: boolean
  showEmojis?: boolean
  showFooter?: boolean
  showSendIcon?: boolean
  showReactionEmojis?: boolean
  showNewMessagesDivider?: boolean
  /**
   * Text-formatting applied to every message body in the active chat.
   */
  textFormatting?: Partial<TextFormattingOptions>
  accept?: string
  multiple?: boolean
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
  customSearchEnabled?: boolean
  chatInfoEnabled?: boolean
}

export interface AdvancedChatEvents {
  (e: 'search-chat', query: string): void
  (e: 'add-chat'): void
  (e: 'fetch-more-chats'): void
  (e: 'fetch-messages'): void
  (e: 'open-chat', chat: ChatModel): void
  (e: 'show-chat-info', chat: ChatModel): void
  (e: 'menu-action-handler', payload: { chat: ChatModel; action: Action }): void
  (e: 'message-action-handler', payload: { action: Action; message: Message }): void
  (
    e: 'message-selection-action-handler',
    payload: { chat: ChatModel; action: Action; messages: Message[] },
  ): void
  (e: 'chat-action-handler', payload: { chat: ChatModel; action: Action }): void
  (e: 'cancel-message-selection'): void
  (e: 'open-file', payload: { file: MessageFile; action: 'preview' | 'download' }): void
  (e: 'open-failed-message', message: Message): void
  (e: 'send-message-reaction', payload: { emoji: string; message: Message }): void
  (e: 'click-user-tag', user: User): void
  (e: 'typing-message', value: string): void
  (
    e: 'send-message',
    payload: { content: string; files: ChatFileItem[]; reply?: Message | null },
  ): void
  (
    e: 'edit-message',
    payload: { messageId: Message['id']; content: string; files: ChatFileItem[] },
  ): void
  /**
   * Re-emitted from `Chat`/`ChatFooter` when a pending file is rejected
   * by a configured `maxFiles` / `maxFileSize` limit.
   */
  (e: 'invalid-file', payload: { file: File; reason: 'size' | 'count' }): void
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

const showChatList = ref(true)

const chatMessages = computed(() => props.messages)

const onShowChatInfo = () => {
  if (!activeChat.value) return

  emit('show-chat-info', activeChat.value)
}

const onOpenChat = (chat: ChatModel) => {
  activeChat.value = chat
  emit('open-chat', chat)
}
</script>

<template>
  <Layout :height="height" :theme="theme">
    <div class="vac-chat-container">
      <Chats
        v-if="showChats && currentUser"
        :current-user="currentUser"
        :chats="chats"
        :chat="activeChat || undefined"
        :loading-chats="loadingChats"
        :chats-loaded="chatsLoaded"
        :show-search="showSearch"
        :show-add-chat="showAddChat"
        :chat-actions="chatActions"
        :custom-search-enabled="customSearchEnabled"
        @search-chat="emit('search-chat', $event)"
        @add-chat="emit('add-chat')"
        @fetch-more-chats="emit('fetch-more-chats')"
        @open-chat="onOpenChat"
        @chat-action-handler="emit('chat-action-handler', $event)"
      />

      <Chat
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
  </Layout>
</template>

<style scoped lang="scss">
.vac-chat-container {
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
</style>
