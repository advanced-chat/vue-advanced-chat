<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import Chat from '@/components/Chat.vue'
import Chats from '@/components/Chats.vue'
import Layout from '@/components/Layout.vue'

import { type Theme } from '../themes'
import type { Action, Chat as ChatModel, Message, UserReference } from '../models'

export interface AdvancedChatProps {
  height?: string
  theme?: Theme
  user?: UserReference | null
  chats?: ChatModel[]
  chat?: ChatModel | null
  messages?: Message[]
  loadingChats?: boolean
  loadingMessages?: boolean
  headerActions?: Action[]
  messageActions?: Action[]
}

const props = withDefaults(defineProps<AdvancedChatProps>(), {
  theme: 'auto',
  user: null,
  chats: () => [],
  chat: null,
  messages: () => [],
  loadingChats: false,
  loadingMessages: false,
  headerActions: () => [],
  messageActions: () => [],
  height: '600px',
})

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
</script>

<template>
  <Layout :height="height" :theme="theme">
    <div class="vac-chat-container">
      <Chats
        v-if="user"
        :user="user"
        :chats="chats"
        :chat="activeChat || undefined"
        :loading-chats="loadingChats"
        @open-chat="activeChat = $event"
      />

      <Chat
        :user="user"
        :chat="activeChat"
        :messages="chatMessages"
        :loading-messages="loadingMessages"
        :show-chat-list="showChatList"
        :header-actions="headerActions"
        :message-actions="messageActions"
        @toggle-chat-list="showChatList = !showChatList"
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
