<script setup lang="ts">
import { toRef } from 'vue'

import { type Theme, type Styles, useThemeStyles } from '../themes'

export interface LayoutProps {
  height?: string
  theme?: Theme
  styles?: Partial<Styles>
}

const props = defineProps<LayoutProps>()

const cssVars = useThemeStyles(toRef(props, 'theme'))
</script>

<template>
  <div class="acc-card-window" :style="[{ height }, cssVars, styles || {}]">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.acc-card-window {
  position: relative;
  width: 100%;
  display: block;
  max-width: 100%;
  background: var(--chat-content-bg-color);
  color: var(--chat-color);
  font-family:
    Inter,
    ui-sans-serif,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  font-size: 14px;
  line-height: 1.5;
  overflow-wrap: break-word;
  white-space: normal;
  overflow: hidden;
  border: var(--chat-container-border);
  border-radius: var(--chat-container-border-radius);
  box-shadow: var(--chat-container-box-shadow);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent;

  * {
    box-sizing: border-box;
    font-family: inherit;
  }

  a {
    color: var(--chat-message-color-tag);
    font-weight: 600;
  }
}
</style>
