<script setup lang="ts">
import ChatsSearch from '@/components/ChatsSearch.vue'
import type { Chat, UserReference } from '../models'
import type { Styles } from '../themes'
import { getLocalizationStrings, type Strings } from '../localization'
import Loader from '@/components/Loader.vue'

export interface ChatsProps {
  showChats?: boolean
  showSearch?: boolean
  showAddChat?: boolean
  loadingChats?: boolean
  isMobile?: boolean
  user?: UserReference
  chats?: Array<Chat>
  styles?: Partial<Styles>
  strings?: Partial<Strings>
}

withDefaults(defineProps<ChatsProps>(), {
  showChats: true,
  showSearch: true,
  showAddChat: true,
  loadingChats: false,
  isMobile: false,
  chats: () => [],
  styles: () => ({}),
  strings: () => getLocalizationStrings('auto'),
})

defineEmits<{
  'search-chat': [query: string]
  'add-chat': []
}>()
</script>

<template>
  <div
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
        :styles="styles"
        :strings="strings"
        @search-chat="$emit('search-chat', $event)"
        @add-chat="$emit('add-chat')"
      >
      </ChatsSearch>
    </slot>

    <Loader :show="loadingChats"> </Loader>

    <div v-if="!loadingChats && !chats.length" class="vac-rooms-empty">
      <slot name="rooms-empty">
        {{ strings['chats.empty'] }}
      </slot>
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
    color: #9ca6af;
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
