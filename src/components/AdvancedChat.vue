<script setup lang="ts">
import Layout from '@/components/Layout.vue'
import ChatsList from '@/components/ChatsList.vue'
import Chat from '@/components/Chat.vue'
import MediaPreview from '@/components/MediaPreview.vue'

import { type Theme, type Styles } from '../themes'

export interface AdvancedChatProps {
  height?: string
  theme?: Theme
  styles?: Styles
}

withDefaults(defineProps<AdvancedChatProps>(), {
  theme: 'auto',
  height: '600px',
})
</script>

<template>
  <Layout :height="height" :theme="theme" :styles="styles">
    <div class="vac-chat-container">
      <ChatsList />

      <Chat />
    </div>
    <transition name="vac-fade-preview" appear>
      <MediaPreview />
    </transition>
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
