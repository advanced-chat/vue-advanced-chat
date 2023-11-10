<template>
  <div class="room-attachment-picker-wrapper">
    <div class="vac-svg-button" @click="openOptions">
      <slot name="paperclip-icon">
        <svg-icon name="paperclip" />
      </slot>
    </div>

    <transition name="vac-slide-up" appear>
      <div
        v-if="optionsOpened"
        ref="menuOptions"
        v-click-outside="closeOptions"
        class="vac-menu-options vac-menu-left"
      >
        <div class="vac-menu-list">
          <div v-for="option in attachmentOptions" :key="option.name">
            <div class="vac-menu-item" @click="attachmentOptionHandler(option)">
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
import SvgIcon from '../../../../components/SvgIcon/SvgIcon'

export default {
  name: 'RoomAttachmentPicker',

  components: {
    SvgIcon
  },

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
    },
    closeOptions() {
      this.optionsOpened = false
    },
    attachmentOptionHandler(option) {
      this.optionsOpened = false
      this.$emit('attachment-picker-handler', option)
    }
  }
}
</script>
