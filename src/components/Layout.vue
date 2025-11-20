<script setup lang="ts">
import { computed } from 'vue'

import { deepMerge, pruneKeys } from '../utils'
import { getThemeStyles, type Theme, type Styles } from '../themes'

export interface LayoutProps {
  height?: string
  theme?: Theme
  styles?: Styles
}

const props = defineProps<LayoutProps>()

const cssVars = computed(() => {
  const baseStyles = getThemeStyles(props.theme || 'auto')
  const overrideStyles = typeof props.styles === 'object' ? props.styles : {}

  return pruneKeys(deepMerge(baseStyles, overrideStyles))
})
</script>

<template>
  <div class="vac-card-window" :style="[{ height }, cssVars]">
    <slot></slot>
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
}
</style>
