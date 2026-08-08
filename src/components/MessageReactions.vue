<script setup lang="ts">
import { computed } from 'vue'

import type { Message, UserReference } from '../models'

export interface MessageReactionsProps {
  /** Identifies the viewer; their entry in each reaction's user list highlights the chip as "mine". */
  currentUser: UserReference
  /** Message whose `reactions` map is rendered. */
  message: Message
}

export interface MessageReactionsEvents {
  /** Fires when a reaction chip is clicked; `reaction` is the existing list of user IDs and the host should toggle `currentUser` in/out. */
  (e: 'send-message-reaction', payload: { emoji: string; reaction: Array<string | number> }): void
}

const props = defineProps<MessageReactionsProps>()

const emit = defineEmits<MessageReactionsEvents>()

const reactions = computed(() => Object.entries(props.message.reactions || {}))

const sendReaction = (event: MouseEvent, emoji: string, reaction: Array<string | number>) => {
  const reactionButton = event.currentTarget as HTMLElement

  if (reactionButton.closest('.vac-message-row-selectable')) return

  event.stopPropagation()
  emit('send-message-reaction', { emoji, reaction })
}
</script>

<template>
  <transition-group v-if="!message.deleted" name="vac-slide-left" tag="div" class="vac-reactions">
    <button
      v-for="[emoji, reaction] in reactions"
      v-show="reaction.length"
      :key="emoji"
      type="button"
      class="vac-button-reaction"
      :class="{ 'vac-reaction-me': reaction.some((id) => id === currentUser.id) }"
      :aria-label="`${emoji} reaction from ${reaction.length} ${reaction.length === 1 ? 'person' : 'people'}`"
      @click="sendReaction($event, emoji, reaction)"
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
  padding: 4px 9px;
  background: var(--chat-message-bg-color-reaction);
  border: var(--chat-message-border-style-reaction);
  color: inherit;
  cursor: pointer;
  font-size: 12px;
  box-shadow: 0 3px 10px rgba(30, 28, 48, 0.06);
  transition:
    transform 0.18s ease,
    background-color 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    background: var(--chat-message-bg-color-reaction-hover);
    border: var(--chat-message-border-style-reaction-hover);
  }

  span {
    margin-left: 4px;
  }

  &.vac-reaction-me {
    background: var(--chat-message-bg-color-reaction-me);
    border: var(--chat-message-border-style-reaction-me);

    &:hover {
      background: var(--chat-message-bg-color-reaction-hover-me);
      border: var(--chat-message-border-style-reaction-hover-me);
    }
  }
}
</style>
