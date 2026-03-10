<script setup lang="ts">
import { type Action, type Chat, typingUsersString, type User, type UserReference } from '../models'
import onClickOutside from '../utils/on-click-outside'

import { useLocalizationStrings } from '../localization'
import { computed, ref, watch } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

const vClickOutside = onClickOutside

const strings = useLocalizationStrings()

export interface ChatHeaderMessageSelection {
  enabled: boolean
  actions: Array<Action>
}

export interface ChatHeaderProps {
  user: UserReference
  chat: Chat
  standalone?: boolean
  showChatList?: boolean
  isMobile?: boolean
  chatInfoEnabled?: boolean
  actions?: Array<Action>
  messageSelection?: ChatHeaderMessageSelection
  selectedMessagesTotal?: number
}

export interface ChatHeaderEvents {
  (e: 'toggle-chat-list'): void
  (e: 'show-chat-info'): void
  (e: 'menu-action-handler', action: Action): void
  (e: 'cancel-message-selection'): void
  (e: 'message-selection-action-handler', action: Action): void
}

const props = withDefaults(defineProps<ChatHeaderProps>(), {
  standalone: false,
  showChatList: false,
  isMobile: false,
  chatInfoEnabled: false,
  actions: () => [],
  messageSelection: () => ({ enabled: false, actions: [] }),
  selectedMessagesTotal: 0,
})

const typingUsers = computed(() => typingUsersString(props.chat, strings))

const userStatus = computed(() => {
  if (!props.chat.users || props.chat.users.length !== 2) return ''

  const otherUser = props.chat.users.find((u: User) => u.id !== props.user.id)

  if (!otherUser?.status) return ''

  let statusText = ''

  if (otherUser.status.state === 'online') {
    statusText = strings['chat.user.is-online']
  } else if (otherUser.status.lastActiveAt) {
    statusText = strings['chat.user.last-seen'] + otherUser.status.lastActiveAt
  }

  return statusText
})

const emit = defineEmits<ChatHeaderEvents>()

const messageSelectionActionHandler = (action: Action) => {
  emit('message-selection-action-handler', action)
}

const messageSelectionAnimationEnded = ref(true)

watch(
  () => props.messageSelection?.enabled,
  (val) => {
    if (val) {
      messageSelectionAnimationEnded.value = false
    } else {
      setTimeout(() => {
        messageSelectionAnimationEnded.value = true
      }, 300)
    }
  },
)

const menuOpened = ref(false)

const closeMenu = () => {
  menuOpened.value = false
}

const menuActionHandler = (action: Action) => {
  closeMenu()
  emit('menu-action-handler', action)
}
</script>

<template>
  <div class="vac-room-header vac-app-border-b">
    <slot name="room-header">
      <div class="vac-room-wrapper">
        <transition name="vac-slide-up">
          <div v-if="messageSelection?.enabled" class="vac-room-selection">
            <div
              v-for="action in messageSelection?.actions || []"
              :id="action.name"
              :key="action.name"
            >
              <div class="vac-selection-button" @click="messageSelectionActionHandler(action)">
                {{ action.title }}
                <span class="vac-selection-button-count">
                  {{ selectedMessagesTotal }}
                </span>
              </div>
            </div>
            <div
              class="vac-selection-cancel vac-item-clickable"
              @click="emit('cancel-message-selection')"
            >
              {{ strings['chat.cancel-selection'] }}
            </div>
          </div>
        </transition>
        <template v-if="!messageSelection?.enabled && messageSelectionAnimationEnded">
          <div
            v-if="!standalone"
            class="vac-svg-button vac-toggle-button"
            :class="{
              'vac-rotate-icon-init': !isMobile,
              'vac-rotate-icon': !showChatList && !isMobile,
            }"
            @click="emit('toggle-chat-list')"
          >
            <slot name="toggle-icon">
              <SvgIcon name="toggle" />
            </slot>
          </div>
          <div
            class="vac-info-wrapper"
            :class="{ 'vac-item-clickable': chatInfoEnabled }"
            @click="emit('show-chat-info')"
          >
            <slot name="room-header-avatar">
              <div
                v-if="chat.icon"
                class="vac-avatar"
                :style="{ 'background-image': `url('${chat.icon}')` }"
              />
            </slot>
            <slot name="room-header-info">
              <div class="vac-text-ellipsis">
                <div class="vac-room-name vac-text-ellipsis">
                  {{ chat.name }}
                </div>
                <div v-if="typingUsers" class="vac-room-info vac-text-ellipsis">
                  {{ typingUsers }}
                </div>
                <div v-else class="vac-room-info vac-text-ellipsis">
                  {{ userStatus }}
                </div>
              </div>
            </slot>
          </div>
          <slot v-if="chat.id" name="room-options">
            <div
              v-if="actions.length"
              class="vac-svg-button vac-room-options"
              @click="menuOpened = !menuOpened"
            >
              <slot name="menu-icon">
                <svg-icon name="menu" />
              </slot>
            </div>
            <transition v-if="actions.length" name="vac-slide-left">
              <div v-if="menuOpened" v-click-outside="closeMenu" class="vac-menu-options">
                <div class="vac-menu-list">
                  <div v-for="action in actions" :key="action.name">
                    <div class="vac-menu-item" @click="menuActionHandler(action)">
                      {{ action.title }}
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </slot>
        </template>
      </div>
    </slot>
  </div>
</template>

<style scoped lang="scss">
.vac-room-header {
  position: var(--chat-header-position);
  display: flex;
  align-items: center;
  height: 64px;
  width: var(--chat-header-width);
  z-index: 10;
  margin-right: 1px;
  background: var(--chat-header-bg-color);
  border-top-right-radius: var(--chat-container-border-radius);

  .vac-room-wrapper {
    display: flex;
    align-items: center;
    min-width: 0;
    height: 100%;
    width: 100%;
    padding: 0 16px;
  }

  .vac-toggle-button {
    margin-right: 15px;

    svg {
      height: 26px;
      width: 26px;
    }
  }

  .vac-rotate-icon {
    &-init {
      transform: rotate(360deg);
    }
    transform: rotate(180deg) !important;
  }

  .vac-info-wrapper {
    display: flex;
    align-items: center;
    min-width: 0;
    width: 100%;
    height: 100%;
  }

  .vac-room-selection {
    display: flex;
    align-items: center;
    min-width: 0;
    width: 100%;
    height: 100%;

    .vac-selection-button {
      padding: 8px 16px;
      color: var(--chat-color-button);
      background-color: var(--chat-bg-color-button);
      border-radius: 4px;
      margin-right: 10px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        opacity: 0.7;
      }

      &:active {
        opacity: 0.9;
      }

      .vac-selection-button-count {
        margin-left: 6px;
        opacity: 0.9;
      }
    }

    .vac-selection-cancel {
      display: flex;
      align-items: center;
      margin-left: auto;
      white-space: nowrap;
      color: var(--chat-color-button-clear);
      transition: all 0.2s;

      &:hover {
        opacity: 0.7;
      }
    }
  }

  .vac-room-name {
    font-size: 17px;
    font-weight: 500;
    line-height: 22px;
    color: var(--chat-header-color-name);
  }

  .vac-room-info {
    font-size: 13px;
    line-height: 18px;
    color: var(--chat-header-color-info);
  }

  .vac-room-options {
    margin-left: auto;
  }

  @media only screen and (max-width: 768px) {
    height: 50px;

    .vac-room-wrapper {
      padding: 0 10px;
    }

    .vac-room-name {
      font-size: 16px;
      line-height: 22px;
    }

    .vac-room-info {
      font-size: 12px;
      line-height: 16px;
    }

    .vac-avatar {
      height: 37px;
      width: 37px;
      min-height: 37px;
      min-width: 37px;
    }
  }
}
</style>
