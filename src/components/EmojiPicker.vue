<template>
  <div ref="container"></div>
</template>

<script setup lang="ts">
import { Picker } from 'emoji-picker-element'
import { ref, useTemplateRef, watch } from 'vue'

const container = useTemplateRef('container')

const picker = ref(new Picker())

export interface EmojiPickerProps {
  opened: boolean
}

const props = defineProps<EmojiPickerProps>()

watch(
  () => props.opened,
  (opened) => {
    setTimeout(() => {
      const _container = container.value
      const _picker = picker.value
      if (opened) {
        _container?.appendChild(_picker)
      } else if (_container?.contains(_picker)) {
        _container?.removeChild(_picker)
      }
    }, 0)
  },
  { immediate: true },
)
</script>
