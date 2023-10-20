<template>
  <div>
    <div class="vac-audio-player">
      <!--      <div class="vac-svg-button" @click="playback">-->
      <!--        <slot v-if="isPlaying" :name="'audio-pause-icon_' + messageId">-->
      <!--          <svg-icon name="audio-pause" />-->
      <!--        </slot>-->
      <!--        <slot v-else :name="'audio-play-icon_' + messageId">-->
      <!--          <svg-icon name="audio-play" />-->
      <!--        </slot>-->
      <!--      </div>-->
      <wave-player
        :id="messageId"
        :key="playerUniqId"
        :duration="duration"
        style="padding-right: 25px; margin-bottom: -20px"
        background-color="transparent"
        wave-color="skyblue"
        progress-color="white"
        :height="25"
        :animate="false" :url="audioSource"
        @update-progress-time="$emit('update-progress-time', $event)"
      />

      <!--            <audio-control-->
      <!--              :percentage="progress"-->
      <!--              :message-selection-enabled="messageSelectionEnabled"-->
      <!--              @change-linehead="onUpdateProgress"-->
      <!--              @hover-audio-progress="$emit('hover-audio-progress', $event)"-->
      <!--            />-->
      <!--      <audio :id="playerUniqId" :src="audioSource" />-->
    </div>
  </div>
</template>

<script>
import WavePlayer from '@/lib/Room/RoomMessage/AudioPlayer/WavePlayer.vue'

export default {
  name: 'AudioPlayer',
  components: {
    WavePlayer
  },

  props: {
    messageId: { type: [String, Number], default: null },
    duration: { type: Number, default: 0, required: false },
    src: { type: String, default: null },
    messageSelectionEnabled: { type: Boolean, required: true }
  },

  emits: ['hover-audio-progress', 'update-progress-time'],

  data() {
  },

  computed: {
    playerUniqId() {
      return `audio-player${this.messageId}`
    },
    audioSource() {
      if (this.src) return this.src
      return null
    }
  },

  mounted() {
  },

  methods: {}
}
</script>
