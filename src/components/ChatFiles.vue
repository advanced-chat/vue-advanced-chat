<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue'
import ChatFile, { type ChatFileItem } from '@/components/ChatFile.vue'

export interface ChatFilesProps {
  files: ChatFileItem[]
}

export interface ChatFilesEvents {
  (e: 'remove-file', index: number): void
  (e: 'reset-message'): void
}

defineProps<ChatFilesProps>()

const emit = defineEmits<ChatFilesEvents>()
</script>

<template>
  <transition name="vac-slide-up">
    <div v-if="files.length" class="vac-room-files-container">
      <div class="vac-files-box">
        <ChatFile
          v-for="(file, index) in files"
          :key="index"
          :file="file"
          :index="index"
          @remove-file="emit('remove-file', $event)"
        />
      </div>

      <div class="vac-icon-close">
        <div class="vac-svg-button" @click="emit('reset-message')">
          <slot name="files-close-icon">
            <SvgIcon name="close-outline" />
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.vac-room-files-container {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px 0;
}

.vac-files-box {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.vac-icon-close {
  margin-left: auto;
}
</style>
