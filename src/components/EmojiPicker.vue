<template>
  <div ref="container"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue'

const container = useTemplateRef('container')

const picker = shallowRef<HTMLElement | null>(null)
let mounted = false

export interface EmojiPickerProps {
  /** When `true`, the underlying `emoji-picker-element` is mounted into the container; setting `false` detaches it. */
  opened: boolean
}

const props = defineProps<EmojiPickerProps>()

const renderPicker = () => {
  const element = container.value
  const pickerElement = picker.value
  if (!element || !pickerElement) return

  if (props.opened && !element.contains(pickerElement)) {
    element.appendChild(pickerElement)
  } else if (!props.opened && element.contains(pickerElement)) {
    element.removeChild(pickerElement)
  }
}

onMounted(async () => {
  mounted = true
  const { Picker } = await import('emoji-picker-element')
  if (!mounted) return
  picker.value = new Picker()
  renderPicker()
})

onBeforeUnmount(() => {
  mounted = false
  picker.value?.remove()
})

watch(() => props.opened, renderPicker)
</script>
