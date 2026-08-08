<script setup lang="ts">
import { computed, nextTick, ref, useId, useTemplateRef } from 'vue'

import SvgIcon from '@/components/SvgIcon.vue'

import type { Action, Message, UserReference } from '../models'
import { vOnClickOutside } from '@vueuse/components'

const REACTION_OPTIONS = ['👍', '❤️', '😂', '🎉', '🔥']

export interface MessageActionsProps {
  /** Identifies the viewer; `ownMessageOnly` actions are hidden when this differs from `message.sender`. */
  currentUser: UserReference
  /** Message these actions apply to. */
  message: Message
  /** Items rendered in the dropdown menu. */
  actions?: Action[]
  /** Renders the quick-reaction emoji picker alongside the dropdown. Defaults to `true`. */
  showReactionEmojis?: boolean
}

export interface MessageActionsEvents {
  /** Fires when an item in the dropdown menu is selected. */
  (e: 'message-action-handler', payload: { action: Action; message: Message }): void

  /** Fires when the viewer picks a quick-reaction emoji; the host should toggle the emoji on the message. */
  (e: 'send-message-reaction', payload: { emoji: string; message: Message }): void
}

const props = withDefaults(defineProps<MessageActionsProps>(), {
  actions: () => [],
  showReactionEmojis: true,
})

const emit = defineEmits<MessageActionsEvents>()

const optionsOpened = ref(false)
const reactionsOpened = ref(false)
const reactionTrigger = useTemplateRef<HTMLButtonElement>('reactionTrigger')
const optionsTrigger = useTemplateRef<HTMLButtonElement>('optionsTrigger')
const reactionMenu = useTemplateRef<HTMLElement>('reactionMenu')
const optionsMenu = useTemplateRef<HTMLElement>('optionsMenu')
const componentId = useId()
const reactionTriggerId = `${componentId}-reaction-trigger`
const reactionMenuId = `${componentId}-reaction-menu`
const optionsTriggerId = `${componentId}-options-trigger`
const optionsMenuId = `${componentId}-options-menu`

const filteredActions = computed(() => {
  if (props.message.sender.id === props.currentUser.id) return props.actions

  return props.actions.filter((action) => !action.ownMessageOnly)
})

const closeAll = () => {
  optionsOpened.value = false
  reactionsOpened.value = false
}

const focusFirstItem = async (menu: Readonly<{ value: HTMLElement | null }>) => {
  await nextTick()
  menu.value?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
}

const toggleReactions = () => {
  const shouldOpen = !reactionsOpened.value
  closeAll()
  reactionsOpened.value = shouldOpen
  if (shouldOpen) void focusFirstItem(reactionMenu)
}

const toggleOptions = () => {
  const shouldOpen = !optionsOpened.value
  closeAll()
  optionsOpened.value = shouldOpen
  if (shouldOpen) void focusFirstItem(optionsMenu)
}

const closeAndFocus = (trigger: Readonly<{ value: HTMLButtonElement | null }>) => {
  closeAll()
  void nextTick(() => trigger.value?.focus())
}

const onEscape = (event: KeyboardEvent) => {
  if (!optionsOpened.value && !reactionsOpened.value) return

  const trigger = optionsOpened.value ? optionsTrigger : reactionTrigger
  event.preventDefault()
  event.stopPropagation()
  closeAndFocus(trigger)
}

const selectReaction = (emoji: string) => {
  emit('send-message-reaction', { emoji, message: props.message })
  closeAndFocus(reactionTrigger)
}

const selectAction = (action: Action) => {
  emit('message-action-handler', { action, message: props.message })
  closeAndFocus(optionsTrigger)
}
</script>

<template>
  <div
    v-if="!message.deleted"
    v-on-click-outside="closeAll"
    class="vac-message-actions-wrapper"
    :class="{ 'vac-message-actions-open': reactionsOpened || optionsOpened }"
    @keydown.esc="onEscape"
  >
    <div class="vac-actions-shell">
      <div v-if="showReactionEmojis" class="vac-reaction-picker">
        <button
          :id="reactionTriggerId"
          ref="reactionTrigger"
          type="button"
          class="vac-svg-button vac-message-options"
          aria-label="Add reaction"
          aria-haspopup="menu"
          :aria-expanded="reactionsOpened"
          :aria-controls="reactionMenuId"
          @click.stop="toggleReactions"
        >
          <slot :name="'emoji-icon_' + message.id">
            <SvgIcon name="emoji" />
          </slot>
        </button>

        <transition name="vac-slide-left">
          <div
            v-if="reactionsOpened"
            :id="reactionMenuId"
            ref="reactionMenu"
            class="vac-reactions-menu"
            role="menu"
            :aria-labelledby="reactionTriggerId"
          >
            <button
              v-for="emoji in REACTION_OPTIONS"
              :key="emoji"
              type="button"
              role="menuitem"
              class="vac-reaction-option"
              :aria-label="`React with ${emoji}`"
              @click.stop="selectReaction(emoji)"
            >
              {{ emoji }}
            </button>
          </div>
        </transition>
      </div>

      <div v-if="filteredActions.length" class="vac-dropdown-picker">
        <button
          :id="optionsTriggerId"
          ref="optionsTrigger"
          type="button"
          class="vac-svg-button vac-message-options"
          aria-label="Message actions"
          aria-haspopup="menu"
          :aria-expanded="optionsOpened"
          :aria-controls="optionsMenuId"
          @click.stop="toggleOptions"
        >
          <slot :name="'dropdown-icon_' + message.id">
            <SvgIcon name="dropdown" param="message" />
          </slot>
        </button>

        <transition name="vac-slide-left">
          <div
            v-if="optionsOpened"
            :id="optionsMenuId"
            ref="optionsMenu"
            class="vac-menu-options"
            role="menu"
            :aria-labelledby="optionsTriggerId"
          >
            <div class="vac-menu-list">
              <button
                v-for="action in filteredActions"
                :key="action.id"
                type="button"
                role="menuitem"
                class="vac-menu-item"
                @click.stop="selectAction(action)"
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
  padding: 3px 7px;
  border-radius: 999px;
  background: var(--chat-dropdown-bg-color);
  border: var(--chat-border-style);
  box-shadow: 0 8px 20px rgba(22, 20, 38, 0.12);
  opacity: 0.72;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;

  &:hover,
  &:focus-within,
  &.vac-message-actions-open {
    opacity: 1;
    transform: translateY(-1px);
  }
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
  border: 0;
  background: transparent;
  color: inherit;

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
