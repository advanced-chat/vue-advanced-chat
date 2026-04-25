<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import ChatFooter from '@/components/ChatFooter.vue'
import ChatHeader, { type ChatHeaderMessageSelection } from '@/components/ChatHeader.vue'
import ChatMessage from '@/components/ChatMessage.vue'
import Loader from '@/components/Loader.vue'
import MediaPreview from '@/components/MediaPreview.vue'

import type { Action, Chat, Message, MessageFile, User, UserReference } from '../models'
import { useLocalizationStrings } from '../localization'
import type { ChatFileItem } from './ChatFile.vue'

const strings = useLocalizationStrings()

/**
 * Action names that `Chat` recognizes and handles internally on top
 * of emitting `message-action-handler`. Consumers can use any other
 * action name and handle it externally.
 */
const REPLY_ACTION = 'reply'
const EDIT_ACTION = 'edit'

export interface ChatProps {
  user?: UserReference | null
  chat?: Chat | null
  messages?: Message[]
  loadingMessages?: boolean
  standalone?: boolean
  showChatList?: boolean
  isMobile?: boolean
  chatInfoEnabled?: boolean
  headerActions?: Action[]
  messageActions?: Action[]
  messageSelection?: ChatHeaderMessageSelection
  showFiles?: boolean
  showEmojis?: boolean
  showFooter?: boolean
  showReactionEmojis?: boolean
  showNewMessagesDivider?: boolean
  acceptedFiles?: string
  multipleFiles?: boolean
  captureFiles?: '' | 'user' | 'environment'
}

export interface ChatEvents {
  (e: 'toggle-chat-list'): void
  (e: 'show-chat-info'): void
  (e: 'menu-action-handler', action: Action): void
  (e: 'message-selection-action-handler', payload: { action: Action; messages: Message[] }): void
  (e: 'cancel-message-selection'): void
  (e: 'opened:file', payload: { file: MessageFile; action: 'preview' | 'download' }): void
  (e: 'typing-message', value: string): void
  (
    e: 'send-message',
    payload: { content: string; files: ChatFileItem[]; reply?: Message | null },
  ): void
  (
    e: 'edit-message',
    payload: { messageId: Message['id']; content: string; files: ChatFileItem[] },
  ): void
  (e: 'message-action-handler', payload: { action: Action; message: Message }): void
  (e: 'clicked:user-tag', user: User): void
  (e: 'send-message-reaction', payload: { emoji: string; message: Message }): void
  (e: 'open-failed-message', payload: { message: Message }): void
}

const props = withDefaults(defineProps<ChatProps>(), {
  user: null,
  chat: null,
  messages: () => [],
  loadingMessages: false,
  standalone: false,
  showChatList: false,
  isMobile: false,
  chatInfoEnabled: false,
  headerActions: () => [],
  messageActions: () => [],
  messageSelection: () => ({ enabled: false, actions: [] }),
  showFiles: true,
  showEmojis: true,
  showFooter: true,
  showReactionEmojis: true,
  showNewMessagesDivider: true,
  acceptedFiles: '*',
  multipleFiles: true,
  captureFiles: '',
})

const emit = defineEmits<ChatEvents>()

const selectedMessages = ref<Message[]>([])
const previewFile = ref<MessageFile | null>(null)
const replyMessage = ref<Message | null>(null)
const editMessage = ref<Message | null>(null)

const users = computed(() => props.chat?.users || [])

watch(
  () => props.chat?.id,
  () => {
    selectedMessages.value = []
    replyMessage.value = null
    editMessage.value = null
  },
)

const messageSelectionActionHandler = (action: Action) => {
  emit('message-selection-action-handler', {
    action,
    messages: selectedMessages.value,
  })
}

const cancelMessageSelection = () => {
  selectedMessages.value = []
  emit('cancel-message-selection')
}

const handleOpenedFile = (payload: { file: MessageFile; action: 'preview' | 'download' }) => {
  if (payload.action === 'preview') {
    previewFile.value = payload.file
  }

  emit('opened:file', payload)
}

const onMessageAction = (payload: { action: Action; message: Message }) => {
  if (payload.action.name === REPLY_ACTION) {
    editMessage.value = null
    replyMessage.value = payload.message
  } else if (payload.action.name === EDIT_ACTION) {
    replyMessage.value = null
    editMessage.value = payload.message
  }

  emit('message-action-handler', payload)
}

const onSelectMessage = (message: Message) => {
  if (!props.messageSelection?.enabled) return

  const exists = selectedMessages.value.some((item) => item.id.toString() === message.id.toString())

  if (exists) {
    selectedMessages.value = selectedMessages.value.filter(
      (item) => item.id.toString() !== message.id.toString(),
    )
  } else {
    selectedMessages.value = [...selectedMessages.value, message]
  }
}
</script>

<template>
  <div class="vac-col-messages">
    <template v-if="!user || !chat">
      <div class="vac-container-center vac-room-empty">
        <slot name="no-chat-selected">
          <div>{{ strings['chat.empty'] }}</div>
        </slot>
      </div>
    </template>

    <template v-else>
      <ChatHeader
        :user="user"
        :chat="chat"
        :standalone="standalone"
        :show-chat-list="showChatList"
        :is-mobile="isMobile"
        :chat-info-enabled="chatInfoEnabled"
        :actions="headerActions"
        :message-selection="messageSelection"
        :selected-messages-total="selectedMessages.length"
        @toggle-chat-list="emit('toggle-chat-list')"
        @show-chat-info="emit('show-chat-info')"
        @menu-action-handler="emit('menu-action-handler', $event)"
        @message-selection-action-handler="messageSelectionActionHandler($event)"
        @cancel-message-selection="cancelMessageSelection"
      />

      <div class="vac-container-scroll">
        <Loader :show="loadingMessages" />

        <div v-if="!loadingMessages && !messages.length" class="vac-room-empty">
          {{ strings['chat.messages.empty'] }}
        </div>

        <div v-else class="vac-messages-container">
          <ChatMessage
            v-for="(message, index) in messages"
            :key="message.id"
            :user="user"
            :message="message"
            :messages="messages"
            :index="index"
            :users="users"
            :actions="messageActions"
            :show-reaction-emojis="showReactionEmojis"
            :show-new-messages-divider="showNewMessagesDivider"
            :message-selection-enabled="messageSelection.enabled"
            :selected="
              selectedMessages.some((selected) => selected.id.toString() === message.id.toString())
            "
            @message-action-handler="onMessageAction"
            @send-message-reaction="emit('send-message-reaction', $event)"
            @opened:file="handleOpenedFile($event)"
            @clicked:user-tag="emit('clicked:user-tag', $event)"
            @select-message="onSelectMessage"
            @open-failed-message="emit('open-failed-message', $event)"
          />
        </div>
      </div>

      <ChatFooter
        :chat="chat"
        :users="users"
        :show-files="showFiles"
        :show-emojis="showEmojis"
        :show-footer="showFooter"
        :accepted-files="acceptedFiles"
        :multiple-files="multipleFiles"
        :capture-files="captureFiles"
        :init-reply-message="replyMessage"
        :init-edit-message="editMessage"
        @typing-message="emit('typing-message', $event)"
        @send-message="emit('send-message', $event)"
        @edit-message="emit('edit-message', $event)"
        @reset-reply-message="replyMessage = null"
        @reset-edit-message="editMessage = null"
      />
    </template>

    <transition name="vac-fade-preview" appear>
      <MediaPreview :file="previewFile" @close-media-preview="previewFile = null" />
    </transition>
  </div>
</template>

<style scoped lang="scss">
.vac-col-messages {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
  height: 100%;
}

.vac-container-scroll {
  position: relative;
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 0 16px 16px;
  background: var(--chat-content-bg-color);
}

.vac-messages-container {
  padding: 12px 0;
}

.vac-room-empty {
  margin: auto;
  color: var(--chat-message-color-started);
  text-align: center;
  padding: 24px;
}

.vac-container-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}
</style>
