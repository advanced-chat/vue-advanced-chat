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

export interface AdvancedChatProps {
  height?: string
  theme?: Theme
  user?: UserReference | null
  chats?: ChatModel[]
  chat?: ChatModel | null
  messages?: Message[]
  loadingChats?: boolean
  chatsLoaded?: boolean
  loadingMessages?: boolean
  headerActions?: Action[]
  messageActions?: Action[]
  chatActions?: Action[]
  messageSelectionActions?: Action[]
  showChats?: boolean
  showSearch?: boolean
  showAddChat?: boolean
  showFiles?: boolean
  showEmojis?: boolean
  showFooter?: boolean
  showSendIcon?: boolean
  showReactionEmojis?: boolean
  showNewMessagesDivider?: boolean
  acceptedFiles?: string
  multipleFiles?: boolean
  captureFiles?: '' | 'user' | 'environment'
  customSearchEnabled?: boolean
  chatInfoEnabled?: boolean
}

export interface AdvancedChatEvents {
  (e: 'search-chat', query: string): void
  (e: 'add-chat'): void
  (e: 'fetch-more-chats'): void
  (e: 'open-chat', chat: ChatModel): void
  (e: 'show-chat-info', chat: ChatModel): void
  (e: 'menu-action-handler', payload: { chat: ChatModel; action: Action }): void
  (e: 'message-action-handler', payload: { action: Action; message: Message }): void
  (e: 'message-selection-action-handler', payload: { action: Action; messages: Message[] }): void
  (e: 'chat-action-handler', payload: { chat: ChatModel; action: Action }): void
  (e: 'cancel-message-selection'): void
  (e: 'opened:file', payload: { file: MessageFile; action: 'preview' | 'download' }): void
  (e: 'open-failed-message', payload: { message: Message }): void
  (e: 'send-message-reaction', payload: { emoji: string; message: Message }): void
  (e: 'clicked:user-tag', user: User): void
  (e: 'typing-message', value: string): void
  (
    e: 'send-message',
    payload: { content: string; files: ChatFileItem[]; reply?: Message | null },
  ): void
  (
    e: 'edit-message',
    payload: { messageId: Message['id']; content: string; files: ChatFileItem[] },
  ): void
}

const props = withDefaults(defineProps<AdvancedChatProps>(), {
  theme: 'auto',
  user: null,
  chats: () => [],
  chat: null,
  messages: () => [],
  loadingChats: false,
  chatsLoaded: false,
  loadingMessages: false,
  headerActions: () => [],
  messageActions: () => [],
  chatActions: () => [],
  messageSelectionActions: () => [],
  showChats: true,
  showSearch: true,
  showAddChat: true,
  showFiles: true,
  showEmojis: true,
  showFooter: true,
  showSendIcon: true,
  showReactionEmojis: true,
  showNewMessagesDivider: true,
  acceptedFiles: '*',
  multipleFiles: true,
  captureFiles: '',
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

const messageSelection = computed(() => ({
  enabled: props.messageSelectionActions.length > 0,
  actions: props.messageSelectionActions,
}))

const onMenuActionHandler = (action: Action) => {
  if (!activeChat.value) return

  emit('menu-action-handler', { chat: activeChat.value, action })
}

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
        v-if="showChats && user"
        :user="user"
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
        :user="user"
        :chat="activeChat"
        :messages="chatMessages"
        :loading-messages="loadingMessages"
        :show-chat-list="showChatList"
        :header-actions="headerActions"
        :message-actions="messageActions"
        :message-selection="messageSelection"
        :show-files="showFiles"
        :show-emojis="showEmojis"
        :show-footer="showFooter"
        :show-reaction-emojis="showReactionEmojis"
        :show-new-messages-divider="showNewMessagesDivider"
        :accepted-files="acceptedFiles"
        :multiple-files="multipleFiles"
        :capture-files="captureFiles"
        :chat-info-enabled="chatInfoEnabled"
        @toggle-chat-list="showChatList = !showChatList"
        @show-chat-info="onShowChatInfo"
        @menu-action-handler="onMenuActionHandler"
        @message-action-handler="emit('message-action-handler', $event)"
        @message-selection-action-handler="emit('message-selection-action-handler', $event)"
        @cancel-message-selection="emit('cancel-message-selection')"
        @opened:file="emit('opened:file', $event)"
        @open-failed-message="emit('open-failed-message', $event)"
        @send-message-reaction="emit('send-message-reaction', $event)"
        @clicked:user-tag="emit('clicked:user-tag', $event)"
        @typing-message="emit('typing-message', $event)"
        @send-message="emit('send-message', $event)"
        @edit-message="emit('edit-message', $event)"
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
