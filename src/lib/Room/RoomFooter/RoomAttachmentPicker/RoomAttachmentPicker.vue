<template>
  <div class="room-attachment-picker-wrapper">
    <div class="vac-svg-button" @click="openOptions">
      <slot name="paperclip-icon">
        <i
          ref="openOptionsIcon"
          class="bi bi-plus-lg vac-open-attachment-list-icon"
        />
      </slot>
    </div>

    <transition name="vac-slide-up" appear>
      <div
        v-if="optionsOpened"
        ref="menuOptions"
        v-click-outside="closeOptions"
        class="vac-menu-options vac-menu-right"
      >
        <div class="vac-menu-list">
          <div v-for="option in attachmentOptions" :key="option.name">
            <hr v-if="option.divider" class="vac-menu-item-divider" />
            <div v-else class="vac-menu-item" @click="attachmentOptionHandler(option)">
              <i class="bi" :class="`bi-${option.icon ?? 'file-earmark'}`" :style="{color: option.color}" />
              {{ option.title }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import vClickOutside from '../../../../utils/on-click-outside'

export default {
  name: 'RoomAttachmentPicker',

  directives: {
		clickOutside: vClickOutside
	},

  props: {
    attachmentOptions: { type: Array, required: true }
  },

  emits: ['attachment-picker-handler'],

  data() {
    return {
      optionsOpened: false
    }
  },

  methods: {
    openOptions() {
      this.optionsOpened = true
      this.$nextTick(() => {
        this.$refs.openOptionsIcon.style.rotate = '135deg'
      })
    },
    closeOptions() {
      this.optionsOpened = false
      this.$nextTick(() => {
        this.$refs.openOptionsIcon.style.rotate = '0deg'
      })
    },
    attachmentOptionHandler(option) {
      this.closeOptions()
      this.$emit('attachment-picker-handler', option)
    }
  }
}
</script>
