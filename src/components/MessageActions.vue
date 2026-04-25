<script setup lang="ts">
import { computed, ref } from 'vue'

import SvgIcon from '@/components/SvgIcon.vue'

import type { Action, Message, UserReference } from '../models'
import { vOnClickOutside } from '@vueuse/components'

const REACTION_OPTIONS = ['👍', '❤️', '😂', '🎉', '🔥']

export interface MessageActionsProps {
  currentUser: UserReference
  message: Message
  actions?: Action[]
  showReactionEmojis?: boolean
}

export interface MessageActionsEvents {
  (e: 'message-action-handler', payload: { action: Action; message: Message }): void
  (e: 'send-message-reaction', payload: { emoji: string; message: Message }): void
}

const props = withDefaults(defineProps<MessageActionsProps>(), {
  actions: () => [],
  showReactionEmojis: true,
})

const emit = defineEmits<MessageActionsEvents>()

const optionsOpened = ref(false)
const reactionsOpened = ref(false)

const filteredActions = computed(() => {
  if (props.message.sender.id === props.currentUser.id) return props.actions

  return props.actions.filter((action) => !action.ownMessageOnly)
})

const closeAll = () => {
  optionsOpened.value = false
  reactionsOpened.value = false
}
</script>

<template>
  <div
    v-if="!message.deleted"
    v-on-click-outside="closeAll"
    class="vac-message-actions-wrapper"
    :class="{ 'vac-message-actions-open': reactionsOpened || optionsOpened }"
  >
    <div class="vac-actions-shell">
      <div v-if="showReactionEmojis" class="vac-reaction-picker">
        <div
          class="vac-svg-button vac-message-options"
          @click.stop="reactionsOpened = !reactionsOpened"
        >
          <slot :name="'emoji-icon_' + message.id">
            <SvgIcon name="emoji" />
          </slot>
        </div>

        <transition name="vac-slide-left">
          <div v-if="reactionsOpened" class="vac-reactions-menu">
            <button
              v-for="emoji in REACTION_OPTIONS"
              :key="emoji"
              class="vac-reaction-option"
              @click.stop="emit('send-message-reaction', { emoji, message })"
            >
              {{ emoji }}
            </button>
          </div>
        </transition>
      </div>

      <div v-if="filteredActions.length" class="vac-dropdown-picker">
        <div
          class="vac-svg-button vac-message-options"
          @click.stop="optionsOpened = !optionsOpened"
        >
          <slot :name="'dropdown-icon_' + message.id">
            <SvgIcon name="dropdown" param="message" />
          </slot>
        </div>

        <transition name="vac-slide-left">
          <div v-if="optionsOpened" class="vac-menu-options" role="menu">
            <div class="vac-menu-list">
              <button
                v-for="action in filteredActions"
                :key="action.id"
                type="button"
                role="menuitem"
                class="vac-menu-item"
                @click.stop="emit('message-action-handler', { action, message })"
              >
                <SvgIcon v-if="action.icon" :name="action.icon" class="vac-menu-item-icon" />
                {{ action.label }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vac-message-actions-wrapper {
  position: absolute;
  bottom: -14px;
  right: 8px;
  z-index: 5;
  padding: 2px 6px;
  border-radius: 999px;
  background: var(--chat-dropdown-bg-color);
  border: var(--chat-border-style);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.vac-actions-shell {
  display: flex;
  align-items: center;
  gap: 4px;
}

.vac-reaction-picker,
.vac-dropdown-picker {
  position: relative;
}

.vac-message-options {
  padding: 2px;
  display: flex;
  align-items: center;

  svg {
    height: 16px;
    width: 16px;
  }
}

.vac-reactions-menu,
.vac-menu-options {
  position: absolute;
  bottom: calc(100% + 6px);
  right: 0;
  z-index: 6;
}

.vac-reactions-menu {
  display: flex;
  gap: 4px;
  padding: 6px;
  background: var(--chat-dropdown-bg-color);
  border-radius: 999px;
  border: var(--chat-border-style);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.vac-reaction-option {
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  padding: 0 4px;
}
</style>
