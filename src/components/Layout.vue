<script setup lang="ts">
import { computed } from 'vue'

import ChatsList from './ChatsList.vue'
import Chat from './Chat.vue'
import MediaPreview from './MediaPreview.vue'

import { baseThemeOptions, cssThemeVars, type Theme, type Styles } from '../themes'
import { deepMerge } from '@/utils/index.ts'

export interface LayoutProps {
  height?: string
  theme?: Theme
  styles?: Styles
}

const props = withDefaults(defineProps<LayoutProps>(), {
  height: '600px',
  theme: 'auto',
})

const cssVars = computed(() => {
  let baseTheme = props.theme || 'auto'

  if (baseTheme === 'auto') {
    baseTheme =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
  }

  const baseOptions = baseThemeOptions[baseTheme]
  const overrideOptions = typeof props.styles === 'object' ? props.styles : {}

  return cssThemeVars(deepMerge(baseOptions, overrideOptions))
})
</script>

<template>
  <div class="vac-card-window" :style="[{ height }, cssVars]">
    <div class="vac-chat-container">
      <ChatsList />

      <Chat />
    </div>
    <transition name="vac-fade-preview" appear>
      <MediaPreview />
    </transition>
  </div>
</template>

<style scoped lang="scss">
.vac-card-window {
  width: 100%;
  display: block;
  max-width: 100%;
  background: var(--chat-content-bg-color);
  color: var(--chat-color);
  overflow-wrap: break-word;
  white-space: normal;
  border: var(--chat-container-border);
  border-radius: var(--chat-container-border-radius);
  box-shadow: var(--chat-container-box-shadow);
  -webkit-tap-highlight-color: transparent;

  * {
    font-family: inherit;
  }

  a {
    color: #0d579c;
    font-weight: 500;
  }

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
}
</style>
