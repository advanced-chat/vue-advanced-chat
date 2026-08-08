<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue'
import ChatFile, { type ChatFileItem } from '@/components/ChatFile.vue'

export interface ChatFilesProps {
  /** Pending composer files. The container animates in when non-empty and hides when empty. */
  files: ChatFileItem[]
}

export interface ChatFilesEvents {
  /** Fires when the user removes a single file; `index` matches its position in `files`. */
  (e: 'remove-file', index: number): void

  /** Fires when the user clears the entire pending-files tray. */
  (e: 'reset-message'): void
}

defineProps<ChatFilesProps>()

const emit = defineEmits<ChatFilesEvents>()
</script>

<template>
  <transition name="acc-slide-up">
    <div v-if="files.length" class="acc-room-files-container">
      <div class="acc-files-box">
        <ChatFile
          v-for="(file, index) in files"
          :key="index"
          :file="file"
          :index="index"
          @remove-file="emit('remove-file', $event)"
        />
      </div>

      <div class="acc-icon-close">
        <button
          type="button"
          class="acc-svg-button"
          aria-label="Remove all attachments"
          @click="emit('reset-message')"
        >
          <slot name="files-close-icon">
            <SvgIcon name="close-outline" />
          </slot>
        </button>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.acc-room-files-container {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px 0;
}

.acc-files-box {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.acc-icon-close {
  margin-left: auto;

  button {
    padding: 0;
    border: 0;
    background: transparent;
  }
}
</style>
