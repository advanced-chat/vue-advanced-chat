<script setup lang="ts">
import { computed } from 'vue'

import type { Message, UserReference } from '../models'

export interface MessageReactionsProps {
  currentUser: UserReference
  message: Message
}

export interface MessageReactionsEvents {
  (e: 'send-message-reaction', payload: { emoji: string; reaction: Array<string | number> }): void
}

const props = defineProps<MessageReactionsProps>()

const emit = defineEmits<MessageReactionsEvents>()

const reactions = computed(() => Object.entries(props.message.reactions || {}))
</script>

<template>
  <transition-group v-if="!message.deleted" name="vac-slide-left" tag="div" class="vac-reactions">
    <button
      v-for="[emoji, reaction] in reactions"
      v-show="reaction.length"
      :key="emoji"
      class="vac-button-reaction"
      :class="{ 'vac-reaction-me': reaction.some((id) => id === currentUser.id) }"
      @click="emit('send-message-reaction', { emoji, reaction })"
    >
      {{ emoji }}<span>{{ reaction.length }}</span>
    </button>
  </transition-group>
</template>

<style scoped lang="scss">
.vac-reactions {
  display: flex;
  gap: 6px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.vac-button-reaction {
  border: 0;
  border-radius: 999px;
  padding: 4px 10px;
  background: var(--chat-message-bg-color-reaction);
  border: var(--chat-message-border-style-reaction);
  color: inherit;
  cursor: pointer;

  span {
    margin-left: 4px;
  }

  &.vac-reaction-me {
    background: var(--chat-message-bg-color-reaction-me);
    border: var(--chat-message-border-style-reaction-me);
  }
}
</style>
