<script setup lang="ts">
import ChatsSearch from '@/components/ChatsSearch.vue'
import type { Action, Chat, Id, UserReference } from '../models'
import Loader from '@/components/Loader.vue'
import { computed, nextTick, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import filterItems from '../utils/filter-items.ts'
import ChatsItem from '@/components/ChatsItem.vue'

import { useLocalizationStrings } from '../localization'

const strings = useLocalizationStrings()

export interface ChatsProps {
  showChats?: boolean
  showSearch?: boolean
  showAddChat?: boolean
  loadingChats?: boolean
  /**
   * Set to `true` once the consumer has delivered every chat available;
   * this disables further `fetch-more-chats` emissions. When `false`
   * (the default), the component asks for more chats when the visible
   * list falls below `minimumVisibleChats` or when the bottom-of-list
   * sentinel scrolls into view.
   */
  chatsLoaded?: boolean
  minimumVisibleChats?: number
  isMobile?: boolean
  user?: UserReference
  chats?: Array<Chat>
  chat?: Chat
  /**
   * Per-chat-row dropdown actions surfaced through `ChatsItem`.
   */
  chatActions?: Array<Action>
  /**
   * When true, `search-chat` is emitted but the local filter is not
   * applied. Use this if the consumer drives chat results from the
   * server based on the search query.
   */
  customSearchEnabled?: boolean
}

export interface ChatsEvents {
  /**
   * Emitted when the search input changes. The local list is filtered
   * automatically unless `customSearchEnabled` is true.
   */
  (event: 'search-chat', query: string): void

  /**
   * Emitted when the add chat button is clicked
   */
  (event: 'add-chat'): void

  /**
   * Emitted to fetch more chats for infinite scrolling
   */
  (event: 'fetch-more-chats'): void

  /**
   * Emitted when a chat is selected to be shown
   */
  (event: 'open-chat', chat: Chat): void

  /**
   * Emitted when more chats are being loaded
   */
  (event: 'loading-more-chats', isLoading: boolean): void

  /**
   * Emitted when a per-chat dropdown action is triggered.
   */
  (event: 'chat-action-handler', payload: { chat: Chat; action: Action }): void
}

const props = withDefaults(defineProps<ChatsProps>(), {
  showChats: true,
  showSearch: true,
  showAddChat: true,
  loadingChats: false,
  chatsLoaded: false,
  minimumVisibleChats: 10,
  isMobile: false,
  chats: () => [],
  chatActions: () => [],
  customSearchEnabled: false,
})

const selectedChatId = ref<Id | null>(null)

const filter = ref<string | null>(null)

const filteredChats = computed(() => {
  const { chats } = props

  return filterItems(chats || [], 'name', filter.value)
})

const emit = defineEmits<ChatsEvents>()

const onSearch = (query: string) => {
  if (!props.customSearchEnabled) {
    filter.value = query || null
  }

  emit('search-chat', query)
}

const root = useTemplateRef('root')

const observer = ref<IntersectionObserver | null>(null)

const showLoader = ref(false)

const loadingMoreChats = ref(false)

const loadMoreChats = () => {
  if (loadingMoreChats.value || props.chatsLoaded) return

  loadingMoreChats.value = true
  showLoader.value = true

  emit('fetch-more-chats')
}

const openChat = (chat: Chat) => {
  selectedChatId.value = chat.id

  emit('open-chat', chat)
}

const initializeIntersectionObserver = () => {
  if (observer.value) {
    showLoader.value = true
    observer.value.disconnect()
  }

  const rootEl = root.value

  if (!rootEl) return

  const loaderEl = rootEl.querySelector('#infinite-loader-rooms')
  const roomsList = rootEl.querySelector('#rooms-list')

  if (loaderEl && roomsList) {
    const options = {
      root: roomsList,
      rootMargin: `100px`,
      threshold: 0,
    }

    observer.value = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        loadMoreChats()
      }
    }, options)

    observer.value.observe(loaderEl)
  }
}

// Set up the loadingMoreChats watcher first so that the immediate chats
// watcher below picks it up when it triggers loadMoreChats.
watch(loadingMoreChats, (val) => {
  emit('loading-more-chats', val)
})

watch(
  () => props.chats,
  (newVal = [], oldVal = []) => {
    const newLength = Array.isArray(newVal) ? newVal.length : 0
    const oldLength = Array.isArray(oldVal) ? oldVal.length : 0

    if (newLength !== oldLength || props.chatsLoaded) {
      loadingMoreChats.value = false
    }

    if (props.chatsLoaded) {
      showLoader.value = false

      return
    }

    const visibleRooms = filteredChats.value

    if (!loadingMoreChats.value && visibleRooms.length < props.minimumVisibleChats) {
      loadMoreChats()
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => props.loadingChats,
  (val) => {
    if (!val) {
      nextTick(() => {
        initializeIntersectionObserver()
      })
    }
  },
)

watch(
  () => props.chatsLoaded,
  (val) => {
    if (val) {
      loadingMoreChats.value = false
      if (!props.loadingChats) {
        showLoader.value = false
      }
    }
  },
  { immediate: true },
)

watch(
  () => props.chat,
  (val) => {
    if (val && !props.isMobile) {
      selectedChatId.value = val.id
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>

<template>
  <div
    v-if="user"
    ref="root"
    class="vac-rooms-container"
    :class="{
      'vac-rooms-container-full': isMobile,
      'vac-app-border-r': !isMobile,
    }"
  >
    <slot name="chats-header" />

    <slot name="chats-search">
      <ChatsSearch
        :show-search="showSearch"
        :show-add-chat="showAddChat"
        :loading-chats="loadingChats"
        :chats="chats"
        @search-chat="onSearch"
        @add-chat="$emit('add-chat')"
      >
      </ChatsSearch>
    </slot>

    <Loader :show="loadingChats"> </Loader>

    <div v-if="!loadingChats && !chats.length" class="vac-rooms-empty">
      <slot name="chats-empty">
        {{ strings['chats.empty'] }}
      </slot>
    </div>

    <div v-if="!loadingChats" id="rooms-list" class="vac-room-list">
      <div
        v-for="chat in filteredChats"
        :id="String(chat.id)"
        :key="chat.id"
        class="vac-room-item"
        :class="{ 'vac-room-selected': selectedChatId === chat.id }"
        @click="openChat(chat)"
      >
        <ChatsItem
          :user="user"
          :chat="chat"
          :actions="chatActions"
          @chat-action-handler="emit('chat-action-handler', $event)"
        >
        </ChatsItem>
      </div>
      <transition name="vac-fade-message">
        <div v-if="chats.length && !loadingChats" id="infinite-loader-rooms">
          <Loader :show="showLoader" :infinite="true" type="infinite-rooms"> </Loader>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vac-rooms-container {
  display: flex;
  flex-flow: column;
  flex: 0 0 25%;
  min-width: 260px;
  max-width: 500px;
  position: relative;
  background: var(--chat-sidemenu-bg-color);
  height: 100%;
  border-top-left-radius: var(--chat-container-border-radius);
  border-bottom-left-radius: var(--chat-container-border-radius);

  &.vac-rooms-container-full {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .vac-rooms-empty {
    font-size: 14px;
    color: var(--chat-message-color-started);
    font-style: italic;
    text-align: center;
    margin: 40px 0;
    line-height: 20px;
    white-space: pre-line;
  }

  .vac-room-list {
    flex: 1;
    position: relative;
    max-width: 100%;
    padding: 0 10px 5px;
    overflow-y: auto;
  }

  .vac-room-item {
    border-radius: 8px;
    align-items: center;
    display: flex;
    flex: 1 1 100%;
    margin-bottom: 5px;
    padding: 0 14px;
    position: relative;
    min-height: 71px;
    transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

    &:hover {
      background: var(--chat-sidemenu-bg-color-hover);
    }

    &:not(.vac-room-selected) {
      cursor: pointer;
    }
  }

  .vac-room-selected {
    color: var(--chat-sidemenu-color-active) !important;
    background: var(--chat-sidemenu-bg-color-active) !important;

    &:hover {
      background: var(--chat-sidemenu-bg-color-active) !important;
    }
  }

  @media only screen and (max-width: 768px) {
    .vac-room-list {
      padding: 0 7px 5px;
    }

    .vac-room-item {
      min-height: 60px;
      padding: 0 8px;
    }
  }
}
</style>
