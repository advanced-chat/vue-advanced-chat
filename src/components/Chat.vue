<script setup lang="ts">
import { computed, ref } from 'vue'

import ChatFooter from '@/components/ChatFooter.vue'
import ChatHeader, { type ChatHeaderMessageSelection } from '@/components/ChatHeader.vue'
import ChatMessage from '@/components/ChatMessage.vue'
import Loader from '@/components/Loader.vue'
import MediaPreview from '@/components/MediaPreview.vue'

import type { Action, Chat, Message, MessageFile, User, UserReference } from '../models'

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
  showFooter?: boolean
  showReactionEmojis?: boolean
}

export interface ChatEvents {
  (e: 'toggle-chat-list'): void
  (e: 'show-chat-info'): void
  (e: 'menu-action-handler', action: Action): void
  (e: 'message-selection-action-handler', action: Action): void
  (e: 'cancel-message-selection'): void
  (
    e: 'send-message',
    payload: { content: string; files: MessageFile[]; reply?: Message | null },
  ): void
  (
    e: 'edit-message',
    payload: { messageId: Message['id']; content: string; files: MessageFile[] },
  ): void
  (e: 'message-action-handler', payload: { action: Action; message: Message }): void
  (e: 'clicked:user-tag', user: User): void
  (e: 'send-message-reaction', payload: { emoji: string; message: Message }): void
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
  showFooter: true,
  showReactionEmojis: true,
})

const emit = defineEmits<ChatEvents>()

const selectedMessages = ref<Message[]>([])
const previewFile = ref<MessageFile | null>(null)

const users = computed(() => props.chat?.users || [])

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
        <div>No chat selected.</div>
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
        @message-selection-action-handler="emit('message-selection-action-handler', $event)"
        @cancel-message-selection="emit('cancel-message-selection')"
      />

      <div class="vac-container-scroll">
        <Loader :show="loadingMessages" />

        <div v-if="!loadingMessages && !messages.length" class="vac-room-empty">
          No messages yet.
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
            :message-selection-enabled="messageSelection.enabled"
            :selected="
              selectedMessages.some((selected) => selected.id.toString() === message.id.toString())
            "
            @message-action-handler="emit('message-action-handler', $event)"
            @send-message-reaction="emit('send-message-reaction', $event)"
            @opened:file="previewFile = $event.action === 'preview' ? $event.file : previewFile"
            @clicked:user-tag="emit('clicked:user-tag', $event)"
            @select-message="onSelectMessage"
          />
        </div>
      </div>

      <ChatFooter
        :chat="chat"
        :users="users"
        :show-footer="showFooter"
        @send-message="emit('send-message', $event)"
        @edit-message="emit('edit-message', $event)"
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
