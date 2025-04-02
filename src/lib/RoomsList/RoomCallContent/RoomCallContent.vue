<template>
  <div class="vac-room-call-container" :class="[ callStatusClass ]" @click="openRoom()">
    <div class="vac-room-info-container">
      <slot :name="'room-list-item_' + room.roomId">
        <slot :name="'room-list-avatar_' + room.roomId">
          <img v-show="room.avatar" :src="room.avatar" class="vac-avatar" />
        </slot>
      </slot>

      <div class="vac-name-container vac-text-ellipsis">
        <div class="vac-title-container">
          <div class="vac-room-name vac-text-ellipsis">
            {{ room.roomName }}
          </div>
        </div>
        <i v-if="!isCallInProgress" class="vac-text-last" style="color: #cccccc;">
          <span v-if="!isCurrentUserCaller">
            {{ textMessages.ROOM_CALL_INCOMING }}
          </span>
          <span v-else>
            {{ textMessages.ROOM_CALL_CALLING }}
          </span>
        </i>
        <i v-else class="vac-text-last" style="color: #cccccc;">
          <span class="vac-call-timer">
            {{ callDuration ?? textMessages.ROOM_CALL_ONGOING }}
          </span>
        </i>
      </div>
    </div>

    <div class="vac-call-actions">
      <a v-if="!isCurrentUserCaller && !isCurrentUserInCall" class="btn" role="button" href="#" @click.stop="acceptCall()">
        <i class="bi bi-telephone-fill" style="margin-right: 1rem;" />
      </a>
      <a v-else-if="isCallInProgress && !isCurrentUserInCall" class="btn" role="button" href="#" @click.stop="returnToCall()">
        <i class="bi bi-box-arrow-right" style="margin-right: 1rem;" />
      </a>
      <a v-else-if="isCallInProgress && isCurrentUserInCall" class="btn" role="button" href="#" @click.stop="returnToCall()">
        <i class="bi bi-box-arrow-up-right" style="margin-right: 1rem;" />
      </a>
      <a class="btn btn-danger" role="button" href="#" @click.stop="hangUpCall()">
        <i class="bi bi-x-lg" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoomCallContent',

  props: {
    currentUserId: { type: [String, Number], required: true },
    room: { type: Object, required: true },
    textMessages: { type: Object, default: () => {} },
    call: { type: Object, required: true }
  },

  emits: [
    'accept-call',
    'hang-up-call',
    'open-room',
    'return-to-call'
  ],

  data() {
    return {
      callDuration: null,
      callInterval: null
    }
  },

  computed: {
    isCurrentUserCaller() {
      return this.call && this.currentUserId === String(this.call.userId)
    },
    isCallPending() {
      return this.call && this.call.statusPending
    },
    isCallInProgress() {
      return this.call && this.call.statusInProgress
    },
    isCurrentUserInCall() {
      return this.call?.isCurrentUserInCall
    },
    callStatusClass() {
      if (this.isCallInProgress) {
        return 'vac-room-call-in-progress'
      } else if (this.isCallPending) {
        return 'vac-room-call-pending'
      } else {
        return ''
      }
    }
  },

  watch: {
    isCallInProgress(value) {
      if (!value) {
        clearInterval(this.callInterval)
        return
      }

      this.updateCallDuration()
      this.callInterval = setInterval(() => {
        this.updateCallDuration()
      }, 1000)
    }
  },

  methods: {
    acceptCall() {
      this.$emit('accept-call', this.call)
    },

    hangUpCall() {
      this.$emit('hang-up-call', this.call)
    },

    returnToCall() {
      this.$emit('return-to-call')
    },

    openRoom() {
      this.$emit('open-room')
    },

    updateCallDuration() {
      if (!this.call) return

      const duration = (new Date() - new Date(this.call.startedAt)) / 1000
      const minutes = String(Math.floor(duration / 60)).padStart(2, '0')
      const seconds = String(Math.floor(duration % 60)).padStart(2, '0')
      this.callDuration = `${minutes}:${seconds}`
    }
  }
}
</script>
