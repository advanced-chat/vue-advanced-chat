<script setup lang="ts">
import { computed } from 'vue'

import SvgIcon from '@/components/SvgIcon.vue'

import type { Chat } from '../models/chat'

import { useLocalizationStrings } from '../localization'

const strings = useLocalizationStrings()

export interface ChatsSearchProps {
  /** Renders the search input. Defaults to `true`. */
  showSearch?: boolean
  /** Renders the "add chat" button to the right of the input. Defaults to `true`. */
  showAddChat?: boolean
  /** When `true`, hides the search input while the chats list is loading. Defaults to `false`. */
  loadingChats?: boolean
  /** Chats list; the input is also hidden when this is empty. */
  chats?: Array<Chat>
}

const props = withDefaults(defineProps<ChatsSearchProps>(), {
  showSearch: true,
  showAddChat: true,
  loadingChats: false,
  chats: () => [],
})

const showSearchBar = computed(() => {
  return props.showSearch || props.showAddChat
})

const emit = defineEmits<{
  'search-chat': [query: string]
  'add-chat': []
}>()

const onSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement

  emit('search-chat', target.value)
}
</script>

<template>
  <div
    :class="{
      'acc-box-search': showSearchBar,
      'acc-box-empty': !showSearchBar,
    }"
  >
    <template v-if="showSearch">
      <div v-if="showSearch && !loadingChats" class="acc-icon-search">
        <slot name="search-icon">
          <svg-icon name="search" />
        </slot>
      </div>
      <input
        v-if="showSearch && !loadingChats"
        type="search"
        :placeholder="strings['chats.search.placeholder']"
        autocomplete="off"
        class="acc-input"
        @input="onSearchInput"
      />
    </template>
    <button
      v-if="showAddChat"
      type="button"
      class="acc-svg-button acc-add-icon"
      aria-label="Add chat"
      @click="emit('add-chat')"
    >
      <slot name="add-icon">
        <svg-icon name="add" />
      </slot>
    </button>
  </div>
</template>

<style scoped lang="scss">
.acc-box-empty {
  margin-top: 10px;

  @media only screen and (max-width: 768px) {
    margin-top: 7px;
  }
}

.acc-box-search {
  position: sticky;
  display: flex;
  align-items: center;
  height: 72px;
  gap: 10px;
  padding: 0 12px;

  .acc-icon-search {
    display: flex;
    position: absolute;
    left: 27px;
    z-index: 1;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  .acc-input {
    height: 42px;
    width: 100%;
    background: var(--chat-bg-color-input);
    color: var(--chat-color);
    font-size: 14px;
    outline: 0;
    caret-color: var(--chat-color-caret);
    padding: 10px 12px 10px 40px;
    border: 1px solid var(--chat-sidemenu-border-color-search);
    border-radius: 12px;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background-color 0.2s ease;

    &:focus {
      border-color: var(--chat-border-color-input-selected);
      box-shadow: 0 0 0 3px
        color-mix(in srgb, var(--chat-border-color-input-selected) 14%, transparent);
    }

    &::placeholder {
      color: var(--chat-color-placeholder);
    }
  }

  .acc-add-icon {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    max-height: 40px;
    margin-left: auto;
    padding: 0;
    border: 0;
    border-radius: 12px;
    background: var(--chat-bg-color-button);
    box-shadow: 0 7px 16px color-mix(in srgb, var(--chat-bg-color-button) 24%, transparent);
  }

  @media only screen and (max-width: 768px) {
    height: 58px;
  }
}
</style>
