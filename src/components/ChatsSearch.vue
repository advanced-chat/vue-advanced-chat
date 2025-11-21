<script setup lang="ts">
import { computed } from 'vue'

import SvgIcon from '@/components/SvgIcon.vue'

import type { Chat } from '../models'
import { getLocalizationStrings, type Strings } from '../localization'
import { type Styles } from '../themes'

export interface ChatsSearchProps {
  showSearch?: boolean
  showAddChat?: boolean
  loadingChats?: boolean
  chats?: Array<Chat>
  styles?: Partial<Styles>
  strings?: Partial<Strings>
}

const props = withDefaults(defineProps<ChatsSearchProps>(), {
  showSearch: true,
  showAddChat: true,
  loadingChats: false,
  chats: () => [],
  styles: () => ({}),
  strings: () => getLocalizationStrings('auto'),
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
      'vac-box-search': showSearchBar,
      'vac-box-empty': !showSearchBar,
    }"
    :style="[styles]"
  >
    <template v-if="showSearch">
      <div v-if="!loadingChats && chats.length" class="vac-icon-search">
        <slot name="search-icon">
          <svg-icon name="search" />
        </slot>
      </div>
      <input
        v-if="!loadingChats && chats.length"
        type="search"
        :placeholder="strings['chats.search.placeholder']"
        autocomplete="off"
        class="vac-input"
        @input="onSearchInput"
      />
    </template>
    <div v-if="showAddChat" class="vac-svg-button vac-add-icon" @click="emit('add-chat')">
      <slot name="add-icon">
        <svg-icon name="add" />
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vac-box-empty {
  margin-top: 10px;

  @media only screen and (max-width: 768px) {
    margin-top: 7px;
  }
}

.vac-box-search {
  position: sticky;
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 15px;

  .vac-icon-search {
    display: flex;
    position: absolute;
    left: 30px;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  .vac-input {
    height: 38px;
    width: 100%;
    background: var(--chat-bg-color-input);
    color: var(--chat-color);
    border-radius: 4px;
    font-size: 15px;
    outline: 0;
    caret-color: var(--chat-color-caret);
    padding: 10px 10px 10px 40px;
    border: 1px solid var(--chat-sidemenu-border-color-search);
    border-radius: 20px;

    &::placeholder {
      color: var(--chat-color-placeholder);
    }
  }

  .vac-add-icon {
    margin-left: auto;
    padding-left: 10px;
  }

  @media only screen and (max-width: 768px) {
    height: 58px;
  }
}
</style>
