<template>
  <div class="vac-card-window" :style="[{ height }, cssVars]">
    <div class="vac-chat-container">
      <rooms-list
        v-if="!singleRoomCasted"
        :current-user-id="currentUserId"
        :rooms="orderedRooms"
        :archived-rooms="archivedRoomsCasted"
        :group-rooms="groupRoomsCasted"
        :unread-rooms="unreadRoomsCasted"
        :custom-search-rooms="customSearchRoomsCasted"
        :loading-rooms="loadingRoomsCasted"
        :rooms-loaded="roomsLoadedCasted"
        :room="room"
        :call="callCasted"
        :room-actions="roomActionsCasted"
        :custom-search-room-enabled="customSearchRoomEnabled"
        :text-messages="t"
        :show-search="showSearchCasted"
        :show-add-room="showAddRoomCasted"
        :show-rooms-list="showRoomsList && roomsListOpenedCasted"
        :text-formatting="textFormattingCasted"
        :link-options="linkOptionsCasted"
        :is-mobile="isMobile"
        :scroll-distance="scrollDistance"
        :room-filter-selected="roomFilterSelected"
        :room-filters="roomFiltersObject"
        @fetch-room="fetchRoom"
        @fetch-more-rooms="fetchMoreRooms"
        @loading-more-rooms="loadingMoreRooms = $event"
        @add-room="addRoom"
        @search-room="searchRoom"
        @room-action-handler="roomActionHandler"
        @accept-call="acceptCallHandler"
        @hang-up-call="hangUpCallHandler"
        @return-to-call="returnToCallHandler"
        @set-room-filter="$emit('set-room-filter', $event)"
      >
        <template v-for="el in slots" #[el.slot]="data">
          <slot :name="el.slot" v-bind="data" />
        </template>
      </rooms-list>
      <room
        :current-user-id="currentUserId"
        :rooms="roomsCasted"
        :archived-rooms="archivedRoomsCasted"
        :custom-search-rooms="customSearchRoomsCasted"
        :room-id="room.roomId || ''"
        :load-first-room="loadFirstRoomCasted"
        :messages="messagesCasted"
        :room-message="roomMessage"
        :messages-loaded-top="messagesLoadedTopCasted"
        :messages-loaded-bottom="messagesLoadedBottomCasted"
        :menu-actions="menuActionsCasted"
        :message-actions="messageActionsCasted"
        :message-selection-actions="messageSelectionActionsCasted"
        :auto-scroll="autoScrollCasted"
        :show-send-icon="showSendIconCasted"
        :show-files="showFilesCasted"
        :show-audio="showAudioCasted"
        :audio-bit-rate="audioBitRate"
        :audio-sample-rate="audioSampleRate"
        :show-emojis="showEmojisCasted"
        :show-reaction-emojis="showReactionEmojisCasted"
        :show-new-messages-divider="showNewMessagesDividerCasted"
        :show-footer="showFooterCasted"
        :text-messages="t"
        :single-room="singleRoomCasted"
        :show-rooms-list="showRoomsList && roomsListOpenedCasted"
        :text-formatting="textFormattingCasted"
        :link-options="linkOptionsCasted"
        :is-mobile="isMobile"
        :loading-rooms="loadingRoomsCasted"
        :room-info-enabled="roomInfoEnabledCasted"
        :textarea-action-enabled="textareaActionEnabledCasted"
        :textarea-auto-focus="textareaAutoFocusCasted"
        :user-tags-enabled="userTagsEnabledCasted"
        :emojis-suggestion-enabled="emojisSuggestionEnabledCasted"
        :scroll-distance="scrollDistance"
        :accepted-files="acceptedFiles"
        :capture-files="captureFiles"
        :multiple-files="multipleFilesCasted"
        :templates-text="templatesTextCasted"
        :username-options="usernameOptionsCasted"
        :emoji-data-source="emojiDataSource"
        :attachment-options="attachmentOptionsCasted"
        :call="callCasted"
        :textarea-highlight="textareaHighlightCasted"
        :external-files="externalFilesCasted"
        :allow-sending-external-files="allowSendingExternalFiles"
        :max-message-rows="maxMessageRows"
        @avatar-click="onAvatarClick"
        @toggle-rooms-list="toggleRoomsList"
        @room-info="roomInfo"
        @fetch-messages="fetchMessages"
        @fetch-messages-top="fetchMessagesTop"
        @fetch-messages-bottom="fetchMessagesBottom"
        @send-message="sendMessage"
        @edit-message="editMessage"
        @delete-message="deleteMessage"
        @open-file="openFile"
        @open-user-tag="openUserTag"
        @open-failed-message="openFailedMessage"
        @menu-action-handler="menuActionHandler"
        @message-action-handler="messageActionHandler"
        @message-selection-action-handler="messageSelectionActionHandler"
        @send-message-reaction="sendMessageReaction"
        @typing-message="typingMessage"
        @textarea-action-handler="textareaActionHandler"
        @message-reaction-click="messageReactionClick"
        @attachment-picker-handler="attachmentPickerHandler"
        @return-to-call="returnToCallHandler"
        @request-permission-to-send-external-files="$emit('request-permission-to-send-external-files', $event)"
        @external-files-removed="$emit('external-files-removed', $event)"
        @new-draft-message="$emit('new-draft-message', $event)"
        @message-reply-click="$emit('message-reply-click', $event)"
        @click-message-username="handleMessageUsernameClick"
      >
        <template v-for="el in slots" #[el.slot]="data">
          <slot :name="el.slot" v-bind="data" />
        </template>
      </room>
    </div>
    <transition name="vac-fade-preview" appear>
      <media-preview
        v-if="showMediaPreview"
        :files="previewFiles"
        :index="previewIndex"
        @close-media-preview="showMediaPreview = false"
      >
        <template v-for="el in slots" #[el.slot]="data">
          <slot :name="el.slot" v-bind="data" />
        </template>
      </media-preview>
    </transition>
  </div>
</template>

<script>
import RoomsList from './RoomsList/RoomsList'
import Room from './Room/Room'
import MediaPreview from './MediaPreview/MediaPreview'

import locales from '../locales'
import { defaultThemeStyles, cssThemeVars } from '../themes'
import {
  roomsValidation,
  partcipantsValidation
} from '../utils/data-validation'

export default {
  name: 'ChatContainer',
  components: {
    RoomsList,
    Room,
    MediaPreview
  },

  props: {
    height: { type: String, default: '600px' },
    theme: { type: String, default: 'light' },
    styles: { type: [Object, String], default: () => ({}) },
    responsiveBreakpoint: { type: Number, default: 900 },
    singleRoom: { type: [Boolean, String], default: false },
    roomsListOpened: { type: [Boolean, String], default: true },
    textMessages: { type: [Object, String], default: () => ({}) },
    currentUserId: { type: String, default: '' },
    rooms: { type: [Array, String], default: () => [] },
    customSearchRooms: { type: [Array, String], default: () => [] },
    archivedRooms: { type: Array, default: () => [] },
    groupRooms: { type: Array, default: () => [] },
    unreadRooms: { type: Array, default: () => [] },
    roomsOrder: { type: String, default: 'desc' },
    loadingRooms: { type: [Boolean, String], default: false },
    roomsLoaded: { type: [Boolean, String], default: false },
    roomId: { type: String, default: null },
    loadFirstRoom: { type: [Boolean, String], default: true },
    messages: { type: [Array, String], default: () => [] },
    messagesLoadedTop: { type: [Boolean, String], default: false },
    messagesLoadedBottom: { type: [Boolean, String], default: false },
    roomActions: { type: [Array, String], default: () => [] },
    menuActions: { type: [Array, String], default: () => [] },
    messageActions: {
      type: [Array, String],
      default: () => [
        { name: 'replyMessage', title: 'Reply' },
        { name: 'editMessage', title: 'Edit Message', onlyMe: true },
        { name: 'deleteMessage', title: 'Delete Message', onlyMe: true },
        { name: 'selectMessages', title: 'Select' }
      ]
    },
    messageSelectionActions: { type: [Array, String], default: () => [] },
    autoScroll: {
      type: [Object, String],
      default: () => {
        return {
          send: {
            new: true,
            newAfterScrollUp: true
          },
          receive: {
            new: true,
            newAfterScrollUp: false
          }
        }
      }
    },
    customSearchRoomEnabled: { type: [Boolean, String], default: false },
    showSearch: { type: [Boolean, String], default: true },
    showAddRoom: { type: [Boolean, String], default: true },
    showSendIcon: { type: [Boolean, String], default: true },
    showFiles: { type: [Boolean, String], default: true },
    showAudio: { type: [Boolean, String], default: true },
    audioBitRate: { type: Number, default: 128 },
    audioSampleRate: { type: Number, default: new (window.AudioContext || window.webkitAudioContext)().sampleRate },
    showEmojis: { type: [Boolean, String], default: true },
    showReactionEmojis: { type: [Boolean, String], default: true },
    showNewMessagesDivider: { type: [Boolean, String], default: true },
    showFooter: { type: [Boolean, String], default: true },
    textFormatting: {
      type: [Object, String],
      default: () => ({
        disabled: false
      })
    },
    linkOptions: {
      type: [Object, String],
      default: () => ({ disabled: false, target: '_blank', rel: null })
    },
    roomInfoEnabled: { type: [Boolean, String], default: false },
    textareaActionEnabled: { type: [Boolean, String], default: false },
    textareaAutoFocus: { type: [Boolean, String], default: true },
    userTagsEnabled: { type: [Boolean, String], default: true },
    emojisSuggestionEnabled: { type: [Boolean, String], default: true },
    roomMessage: { type: String, default: '' },
    scrollDistance: { type: Number, default: 60 },
    acceptedFiles: { type: String, default: '*' },
    captureFiles: { type: String, default: undefined },
    multipleFiles: { type: [Boolean, String], default: true },
    templatesText: { type: [Array, String], default: () => [] },
    mediaPreviewEnabled: { type: [Boolean, String], default: true },
    usernameOptions: {
      type: [Object, String],
      default: () => ({ minUsers: 3, currentUser: false })
    },
    emojiDataSource: { type: String, default: undefined },
    attachmentOptions: { type: Array, default: () => [] },
    call: { type: [Object, String], default: () => ({}) },
    textareaHighlight: { type: Boolean, default: false },
    externalFiles: { type: Array, default: () => [] },
    allowSendingExternalFiles: { type: Boolean, default: null },
    maxMessageRows: { type: Number, default: 0 },
    roomFilters: { type: String, default: () => {} },
    roomFilterSelected: { type: String, required: true }
  },

  emits: [
    'toggle-rooms-list',
    'room-info',
    'fetch-messages',
    'fetch-messages-top',
    'fetch-messages-bottom',
    'send-message',
    'edit-message',
    'delete-message',
    'open-file',
    'open-user-tag',
    'open-failed-message',
    'menu-action-handler',
    'message-action-handler',
    'send-message-reaction',
    'typing-message',
    'textarea-action-handler',
    'fetch-more-rooms',
    'add-room',
    'search-room',
    'room-action-handler',
    'message-selection-action-handler',
    'message-reaction-click',
    'attachment-picker-handler',
    'accept-call',
    'hang-up-call',
    'return-to-call',
    'request-permission-to-send-external-files',
    'external-files-removed',
    'new-draft-message',
    'message-reply-click',
    'click-message-username',
    'set-room-filter'
  ],

  data() {
    return {
      slots: [],
      room: {},
      loadingMoreRooms: false,
      showRoomsList: true,
      isMobile: false,
      showMediaPreview: false,
      previewFiles: [],
      roomFiltersObject: {}
    }
  },

  computed: {
    t() {
      return {
        ...locales,
        ...this.textMessagesCasted
      }
    },
    cssVars() {
      const defaultStyles = defaultThemeStyles[this.theme]
      const customStyles = {}

      Object.keys(defaultStyles).map(key => {
        customStyles[key] = {
          ...defaultStyles[key],
          ...(this.stylesCasted[key] || {})
        }
      })

      return cssThemeVars(customStyles)
    },
    orderedRooms() {
      return this.roomsCasted.slice().sort((a, b) => {
        const aVal = a.index || 0
        const bVal = b.index || 0

        if (this.roomsOrder === 'asc') {
          return aVal < bVal ? -1 : bVal < aVal ? 1 : 0
        }

        return aVal > bVal ? -1 : bVal > aVal ? 1 : 0
      })
    },
    archivedRoomsCasted() {
      return this.castArray(this.archivedRooms)
    },
    groupRoomsCasted() {
      return this.castArray(this.groupRooms)
    },
    unreadRoomsCasted() {
      return this.castArray(this.unreadRooms)
    },
    singleRoomCasted() {
      return this.castBoolean(this.singleRoom)
    },
    roomsListOpenedCasted() {
      return this.castBoolean(this.roomsListOpened)
    },
    loadingRoomsCasted() {
      return this.castBoolean(this.loadingRooms)
    },
    roomsLoadedCasted() {
      return this.castBoolean(this.roomsLoaded)
    },
    loadFirstRoomCasted() {
      return this.castBoolean(this.loadFirstRoom)
    },
    messagesLoadedTopCasted() {
      return this.castBoolean(this.messagesLoadedTop)
    },
    messagesLoadedBottomCasted() {
      return this.castBoolean(this.messagesLoadedBottom)
    },
    multipleFilesCasted() {
      return this.castBoolean(this.multipleFiles)
    },
    showSearchCasted() {
      return this.castBoolean(this.showSearch)
    },
    showAddRoomCasted() {
      return this.castBoolean(this.showAddRoom)
    },
    showSendIconCasted() {
      return this.castBoolean(this.showSendIcon)
    },
    showFilesCasted() {
      return this.castBoolean(this.showFiles)
    },
    showAudioCasted() {
      return this.castBoolean(this.showAudio)
    },
    showEmojisCasted() {
      return this.castBoolean(this.showEmojis)
    },
    showReactionEmojisCasted() {
      return this.castBoolean(this.showReactionEmojis)
    },
    showNewMessagesDividerCasted() {
      return this.castBoolean(this.showNewMessagesDivider)
    },
    showFooterCasted() {
      return this.castBoolean(this.showFooter)
    },
    roomInfoEnabledCasted() {
      return this.castBoolean(this.roomInfoEnabled)
    },
    textareaActionEnabledCasted() {
      return this.castBoolean(this.textareaActionEnabled)
    },
    textareaAutoFocusCasted() {
      return this.castBoolean(this.textareaAutoFocus)
    },
    userTagsEnabledCasted() {
      return this.castBoolean(this.userTagsEnabled)
    },
    emojisSuggestionEnabledCasted() {
      return this.castBoolean(this.emojisSuggestionEnabled)
    },
    mediaPreviewEnabledCasted() {
      return this.castBoolean(this.mediaPreviewEnabled)
    },
    roomsCasted() {
      return this.castArray(this.rooms)
    },
    customSearchRoomsCasted() {
      return this.castArray(this.customSearchRooms)
    },
    messagesCasted() {
      return this.castArray(this.messages)
    },
    roomActionsCasted() {
      return this.castArray(this.roomActions)
    },
    menuActionsCasted() {
      return this.castArray(this.menuActions)
    },
    messageActionsCasted() {
      return this.castArray(this.messageActions)
    },
    messageSelectionActionsCasted() {
      return this.castArray(this.messageSelectionActions)
    },
    templatesTextCasted() {
      return this.castArray(this.templatesText)
    },
    stylesCasted() {
      return this.castObject(this.styles)
    },
    textMessagesCasted() {
      return this.castObject(this.textMessages)
    },
    autoScrollCasted() {
      return this.castObject(this.autoScroll)
    },
    textFormattingCasted() {
      return this.castObject(this.textFormatting)
    },
    linkOptionsCasted() {
      return this.castObject(this.linkOptions)
    },
    usernameOptionsCasted() {
      return this.castObject(this.usernameOptions)
    },
    attachmentOptionsCasted() {
      return this.castArray(this.attachmentOptions)
    },
    callCasted() {
      return this.castObject(this.call)
    },
    textareaHighlightCasted() {
      return this.castBoolean(this.textareaHighlight)
    },
    externalFilesCasted() {
      return this.castArray(this.externalFiles)
    }
  },

  watch: {
    roomsCasted: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (
          !newVal[0] ||
          !newVal.find(room => room.roomId === this.room.roomId)
        ) {
          this.showRoomsList = true
        }

        if (
          !this.loadingMoreRooms &&
          this.loadFirstRoomCasted &&
          newVal[0] &&
          (!oldVal || newVal.length !== oldVal.length)
        ) {
          if (this.roomId) {
            const room = newVal.find(r => r.roomId === this.roomId) || {}
            this.fetchRoom({ room })
          } else if (!this.isMobile || this.singleRoomCasted) {
            this.fetchRoom({ room: this.orderedRooms[0] })
          } else {
            this.showRoomsList = true
          }
        }
      }
    },

    roomId: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal && !this.loadingRoomsCasted && this.roomsCasted.length) {
          let room = null
          switch (this.roomFilterSelected) {
          case this.roomFiltersObject.ARCHIVED.name:
            room = this.archivedRoomsCasted.find(r => r.roomId === newVal)
            break
          default:
            room = this.roomsCasted.find(r => r.roomId === newVal)
            break
          }

          if (room) {
            this.fetchRoom({ room })
          }
        } else if (oldVal && !newVal) {
          this.room = {}
        }
      }
    },

    room(val) {
      if (!val || Object.entries(val).length === 0) return

      roomsValidation(val)

      val.users.forEach(user => {
        partcipantsValidation(user)
      })
    },

    roomsListOpenedCasted: {
      immediate: true,
      handler(val) {
        this.showRoomsList = val
      }
    }
  },

  created() {
    this.roomFiltersObject = JSON.parse(this.roomFilters)
    this.$emit('set-room-filter', this.roomFiltersObject.DEFAULT.name)
    this.updateResponsive()
    window.addEventListener('resize', ev => {
      if (ev.isTrusted) this.updateResponsive()
    })
  },

  updated() {
    const slots = document.querySelectorAll('[slot]')
    if (this.slots.length !== slots.length) {
      this.slots = slots
    }
  },

  methods: {
    handleMessageUsernameClick(event) {
      this.$emit('set-room-filter', this.roomFiltersObject.DEFAULT.name)
      this.$emit('click-message-username', event)
    },
    castBoolean(val) {
      return val === 'true' || val === true
    },
    castArray(val) {
      return !val ? [] : Array.isArray(val) ? val : JSON.parse(val)
    },
    castObject(val) {
      return !val ? {} : typeof val === 'object' ? val : JSON.parse(val)
    },
    updateResponsive() {
      this.isMobile = window.innerWidth < Number(this.responsiveBreakpoint)
    },
    toggleRoomsList() {
      this.showRoomsList = !this.showRoomsList
      if (this.isMobile) this.room = {}
      this.$emit('toggle-rooms-list', { opened: this.showRoomsList })
    },
    fetchRoom({ room }) {
      this.room = room
      this.fetchMessages({ reset: true })
      this.fetchMessagesTop({ reset: true })
      if (this.isMobile) this.showRoomsList = false
    },
    fetchMoreRooms() {
      this.$emit('fetch-more-rooms')
    },
    roomInfo() {
      this.$emit('room-info', this.room)
    },
    onAvatarClick(id) {
      if (this.room?.isIndividual) {
        this.roomInfo()
        return
      }
      this.$emit('room-info', { userId: id })
    },
    addRoom() {
      this.$emit('add-room')
    },
    searchRoom(val) {
      this.$emit('search-room', { value: val, roomId: this.room.roomId })
    },
    /**
     * @deprecated The method should not be used. Use fetchMessagesTop instead.
     */
    fetchMessages(options) {
      this.$emit('fetch-messages', { room: this.room, options })
    },
    fetchMessagesTop(options) {
      this.$emit('fetch-messages-top', { room: this.room, options })
    },
    fetchMessagesBottom(options) {
      this.$emit('fetch-messages-bottom', { room: this.room, options })
    },
    sendMessage(message) {
      this.$emit('send-message', { ...message, roomId: this.room.roomId })
    },
    editMessage(message) {
      this.$emit('edit-message', { ...message, roomId: this.room.roomId })
    },
    deleteMessage(message) {
      this.$emit('delete-message', { message, roomId: this.room.roomId })
    },
    openFile(event) {
      const file = typeof event?.files !== 'undefined' ? event?.files[event.index] : event.file
      const message = event.message

      if (this.mediaPreviewEnabledCasted && event.action === 'preview') {
        this.previewFiles = event.files ?? [ file ]
        this.previewIndex = event.index ?? 0
        this.showMediaPreview = true
      } else {
        this.$emit('open-file', { message, file: file, action: event.action })
      }
    },
    openUserTag({ user }) {
      this.$emit('open-user-tag', { user })
    },
    openFailedMessage({ message }) {
      this.$emit('open-failed-message', {
        message,
        roomId: this.room.roomId
      })
    },
    menuActionHandler(ev) {
      this.$emit('menu-action-handler', {
        action: ev,
        roomId: this.room.roomId
      })
    },
    roomActionHandler({ action, roomId }) {
      this.$emit('room-action-handler', {
        action,
        roomId
      })
    },
    acceptCallHandler(call) {
      this.$emit('accept-call', call)
    },
    hangUpCallHandler(call) {
      this.$emit('hang-up-call', call)
    },
    messageActionHandler(ev) {
      this.$emit('message-action-handler', {
        ...ev,
        roomId: this.room.roomId
      })
    },
    messageSelectionActionHandler(ev) {
      this.$emit('message-selection-action-handler', {
        ...ev,
        roomId: this.room.roomId
      })
    },
    sendMessageReaction(messageReaction) {
      this.$emit('send-message-reaction', {
        ...messageReaction,
        roomId: this.room.roomId
      })
    },

    messageReactionClick(messageReaction) {
      this.$emit('message-reaction-click', {
        ...messageReaction,
        roomId: this.room.roomId
      })
    },

    typingMessage(message) {
      this.$emit('typing-message', {
        message,
        roomId: this.room.roomId
      })
    },

    textareaActionHandler(message) {
      this.$emit('textarea-action-handler', {
        message,
        roomId: this.room.roomId
      })
    },

    attachmentPickerHandler(option) {
      this.$emit('attachment-picker-handler', {
        option
      })
    },

    returnToCallHandler(call) {
      this.$emit('return-to-call', call)
    }
  }
}
</script>

<style lang="scss">
@import '../styles/index.scss';
</style>
