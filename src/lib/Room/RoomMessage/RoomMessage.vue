<template>
	<div
    :id="message._id" ref="message"
    class="vac-message-wrapper"
    :class="{'vac-selection-enabled': messageSelectionEnabled, 'message-selected' : isMessageSelected, 'message-system': message.system}"
    @click="selectMessage"
  >
		<div v-if="showDate" class="vac-card-date-container">
      <div class="vac-card-info vac-card-date">
        {{ message.date }}
      </div>
		</div>

		<div v-if="newMessage._id === message._id">
      <slot name="line-new">
        <div class="vac-line-new">
          {{ textMessages.NEW_MESSAGES }}
        </div>
      </slot>
		</div>

		<div v-if="message.system" class="vac-card-info vac-card-system">
			<slot :name="'message_' + message._id">
				<format-message
					:message-id="message._id"
					:content="message.content"
					:deleted="!!message.deleted"
					:users="roomUsers"
					:text-messages="textMessages"
					:text-formatting="textFormatting"
					:link-options="linkOptions"
					@open-user-tag="openUserTag"
				>
					<template v-for="(idx, name) in $slots" #[name]="data">
						<slot :name="name" v-bind="data" />
					</template>
				</format-message>
			</slot>
		</div>
    <div
      v-else-if="message.dynamic"
      class="vac-message-dynamic vac-message-box-container"
      :class="[
        `vac-message-dynamic-pos-${message.dynamic.position ?? 'center'}`,
        `vac-message-dynamic-${message.dynamic.type ?? 'info'}`
      ]"
    >
      <label v-if="messageSelectionEnabled && !message.system" class="checkbox-message-container">
        <div class="checkbox" :class="{ 'selected': isMessageSelected }" />
      </label>

      <div class="vac-message-container">
        <div class="vac-message-card">
          <div
            v-if="message.dynamic.title"
            class="vac-message-dynamic-title"
          >
            <span>{{ message.dynamic.title }}</span>
          </div>

          <div
            v-if="message.loading"
            class="vac-message-loading"
          >
            <div class="vac-message-loading-item" style="width: 93%;" />
            <div class="vac-message-loading-item" style="width: 98%;" />
            <div class="vac-message-loading-item" style="width: 91%;" />
            <div class="vac-message-loading-item" style="width: 95%;" />
            <div class="vac-message-loading-item" style="width: 78%;" />
          </div>

          <format-message
            v-else-if="!!message.deleted || !message.files || !message.files.length"
            :message-id="message._id"
            :content="message.content"
            :deleted="!!message.deleted"
            :users="roomUsers"
            :text-formatting="textFormatting"
            :text-messages="textMessages"
            :link-options="linkOptions"
            @open-user-tag="openUserTag"
            @mousedown="startContentSelection"
            @mouseup="endContentSelection"
          >
            <template v-for="(idx, name) in $slots" #[name]="data">
              <slot :name="name" v-bind="data" />
            </template>
          </format-message>
        </div>
      </div>
    </div>
    <div
      v-else
      :class="{ 'vac-offset-current': message.senderId === currentUserId }"
      class="vac-message-box-container"
    >
      <label v-if="messageSelectionEnabled && !message.system" class="checkbox-message-container">
        <div class="checkbox" :class="{ 'selected': isMessageSelected }" />
      </label>
      <div
        ref="messageBox"
        class="vac-message-box"
      >
        <slot :name="'message_' + message._id">
          <slot
            v-if="message.senderId !== currentUserId"
            :name="'message-avatar_' + message._id"
          >
            <div
              v-if="message.avatar && !messageSelectionEnabled"
              class="vac-avatar"
              :style="{ 'background-image': `url('${message.avatar}')` }"
            />
          </slot>
          <div
            v-if="hasSenderUserAvatar && !message.avatar"
            class="vac-avatar-offset"
          />
          <div
            class="vac-message-container"
            :class="{
						'vac-message-container-offset': messageOffset
					}"
          >
            <div
              class="vac-message-card"
              :class="{
                'vac-message-highlight': isMessageHover,
                'vac-message-current': message.senderId === currentUserId,
                'vac-message-deleted': message.deleted,
                'vac-item-clickable': messageSelectionEnabled,
                'vac-message-selected': isMessageSelected
              }"
              @mouseover="onHoverMessage"
              @mouseleave="onLeaveMessage"
              @mousemove="messageHover = !isSelectingContent"
            >
              <div
                v-if="showUsername"
                class="vac-text-username"
                :class="{
                  'vac-username-reply': !message.deleted && message.replyMessage
                }"
                @click="onClickMessageUsername"
              >
                <span>{{ message.username }}</span>
              </div>

              <div v-if="!message.deleted && message.isForwarded" :class="{'message-forwarded-container': !message.deleted && message.isForwarded}">
                <span class="forward-icon">
                  <svg viewBox="0 0 16 16" height="16" width="16" preserveAspectRatio="xMidYMid meet" class="" version="1.1">
                    <path d="M9.51866667,3.87533333 C9.51866667,3.39333333 10.1006667,3.152 10.4406667,3.49266667 L14.4706667,7.52666667 C14.682,7.738 14.682,8.07933333 14.4706667,8.29066667 L10.4406667,12.3246667 C10.1006667,12.6646667 9.51866667,12.424 9.51866667,11.942 L9.51866667,10.1206667 C6.12133333,10.1206667 3.63266667,11.0906667 1.78266667,13.1946667 C1.61866667,13.3806667 1.31466667,13.2226667 1.38133333,12.984 C2.33466667,9.53533333 4.66466667,6.31466667 9.51866667,5.62066667 L9.51866667,3.87533333 Z" fill="currentColor" />
                  </svg>
                </span>
                <span class="forward-text">{{ textMessages.MESSAGE_FORWARD }}</span>
              </div>

              <message-reply
                v-if="!message.deleted && message.replyMessage"
                :message="message"
                :room-users="roomUsers"
                :text-formatting="textFormatting"
                :link-options="linkOptions"
                @click="() => $emit('message-reply-click', message.replyMessage)"
              >
                <template v-for="(i, name) in $slots" #[name]="data">
                  <slot :name="name" v-bind="data" />
                </template>
              </message-reply>

              <format-message
                v-if="!!message.deleted || !message.files || !message.files.length"
                :message-id="message._id"
                :content="message.content"
                :deleted="!!message.deleted"
                :users="roomUsers"
                :text-formatting="textFormatting"
                :text-messages="textMessages"
                :link-options="linkOptions"
                @open-user-tag="openUserTag"
                @mousedown="startContentSelection"
                @mouseup="endContentSelection"
              >
                <template v-for="(idx, name) in $slots" #[name]="data">
                  <slot :name="name" v-bind="data" />
                </template>
              </format-message>

              <message-files
                v-else-if="!isAudio || message.files.length > 1"
                :current-user-id="currentUserId"
                :message="message"
                :room-users="roomUsers"
                :text-formatting="textFormatting"
                :link-options="linkOptions"
                :message-selection-enabled="messageSelectionEnabled"
                @open-file="openFile"
                @open-user-tag="openUserTag"
              >
                <template v-for="(i, name) in $slots" #[name]="data">
                  <slot :name="name" v-bind="data" />
                </template>
              </message-files>

              <template v-else>
                <audio-player
                  :message-id="message._id"
                  :src="message.files[0].url"
                  :message-selection-enabled="messageSelectionEnabled"
                  @update-progress-time="progressTime = $event"
                  @hover-audio-progress="hoverAudioProgress = $event"
                >
                  <template v-for="(i, name) in $slots" #[name]="data">
                    <slot :name="name" v-bind="data" />
                  </template>
                </audio-player>

                <div v-if="!message.deleted" class="vac-progress-time">
                  {{ progressTime }}
                </div>
              </template>

              <a v-if="hasTruncatedContent" href="javascript:void(0)" class="vac-message-see-more" @click="expandMessageContent">
                {{ textMessages.MESSAGE_READ_MORE }}
              </a>

              <div class="vac-text-timestamp">
                <div
                  v-if="message.edited && !message.deleted"
                  class="vac-icon-edited"
                >
                  <slot :name="'pencil-icon_' + message._id">
                    {{ textMessages.MESSAGE_EDITED }}
                  </slot>
                </div>
                <span>{{ message.timestamp }}</span>
                <span v-if="isCheckmarkVisible">
                  <slot :name="'checkmark-icon_' + message._id">
                    <svg-icon
                      :name="
                        message.distributed ? 'double-checkmark' : 'checkmark'
                      "
                      :param="message.seen ? 'seen' : ''"
                      class="vac-icon-check"
                    />
                  </slot>
                </span>
              </div>

              <message-actions
                :current-user-id="currentUserId"
                :message="message"
                :message-actions="messageActions"
                :show-reaction-emojis="showReactionEmojis"
                :message-hover="messageHover"
                :hover-message-id="hoverMessageId"
                :hover-audio-progress="hoverAudioProgress"
                :emoji-data-source="emojiDataSource"
                @update-message-hover="messageHover = !isSelectingContent && $event"
                @update-options-opened="optionsOpened = $event"
                @update-emoji-opened="emojiOpened = $event"
                @message-action-handler="messageActionHandler"
                @send-message-reaction="sendMessageReaction"
              >
                <template v-for="(i, name) in $slots" #[name]="data">
                  <slot :name="name" v-bind="data" />
                </template>
              </message-actions>
            </div>

            <message-reactions
              :current-user-id="currentUserId"
              :message="message"
              @message-reaction-click="messageReactionClick"
            />
          </div>
          <slot :name="'message-failure_' + message._id">
            <div
              v-if="message.failure && message.senderId === currentUserId"
              class="vac-failure-container vac-svg-button"
              :class="{
							'vac-failure-container-avatar':
								message.avatar && message.senderId === currentUserId
						}"
              @click="$emit('open-failed-message', { message })"
            >
              <div class="vac-failure-text">!</div>
            </div>
          </slot>
          <slot
            v-if="message.senderId === currentUserId"
            :name="'message-avatar_' + message._id"
          >
            <div
              v-if="message.avatar && !messageSelectionEnabled"
              class="vac-avatar vac-avatar-current"
              :style="{ 'background-image': `url('${message.avatar}')` }"
            />
          </slot>
          <div
            v-if="hasCurrentUserAvatar && !message.avatar"
            class="vac-avatar-current-offset"
          />
        </slot>
      </div>
    </div>
    </div>
</template>

<script>
import SvgIcon from '../../../components/SvgIcon/SvgIcon'
import FormatMessage from '../../../components/FormatMessage/FormatMessage'

import MessageReply from './MessageReply/MessageReply'
import MessageFiles from './MessageFiles/MessageFiles'
import MessageActions from './MessageActions/MessageActions'
import MessageReactions from './MessageReactions/MessageReactions'
import AudioPlayer from './AudioPlayer/AudioPlayer'

import { messagesValidation } from '../../../utils/data-validation'
import { isAudioFile } from '../../../utils/media-file'

export default {
	name: 'RoomMessage',
	components: {
		SvgIcon,
		FormatMessage,
		AudioPlayer,
		MessageReply,
		MessageFiles,
		MessageActions,
		MessageReactions
	},

	props: {
		currentUserId: { type: [String, Number], required: true },
		textMessages: { type: Object, required: true },
		index: { type: Number, required: true },
		message: { type: Object, required: true },
		messages: { type: Array, required: true },
		editedMessageId: { type: [String, Number], default: null },
		roomUsers: { type: Array, default: () => [] },
		messageActions: { type: Array, required: true },
		newMessages: { type: Array, default: () => [] },
		showReactionEmojis: { type: Boolean, required: true },
		showNewMessagesDivider: { type: Boolean, required: true },
		textFormatting: { type: Object, required: true },
		linkOptions: { type: Object, required: true },
		usernameOptions: { type: Object, required: true },
		messageSelectionEnabled: { type: Boolean, required: true },
		selectedMessages: { type: Array, default: () => [] },
		emojiDataSource: { type: String, default: undefined },
    maxMessageRows: { type: Number, default: 0 }
	},

	emits: [
		'message-added',
		'open-file',
		'open-user-tag',
		'open-failed-message',
		'message-action-handler',
		'send-message-reaction',
		'select-message',
		'unselect-message',
    'message-reaction-click',
    'message-reply-click',
    'click-message-username'
	],

	data() {
		return {
			hoverMessageId: null,
			messageHover: false,
      isSelectingContent: false,
			optionsOpened: false,
			emojiOpened: false,
			newMessage: {},
			progressTime: '- : -',
			hoverAudioProgress: false,
      hasTruncatedContent: false
		}
	},

	computed: {
		showUsername() {
			if (
				!this.usernameOptions.currentUser &&
				this.message.senderId === this.currentUserId
			) {
				return false
			} else {
				return this.roomUsers.length >= this.usernameOptions.minUsers
			}
		},
		showDate() {
			return (
				this.index > 0 &&
				this.message.date !== this.messages[this.index - 1].date
			)
		},
		messageOffset() {
			return (
				this.index > 0 &&
				this.message.senderId !== this.messages[this.index - 1].senderId
			)
		},
		isMessageHover() {
			return (
				this.editedMessageId === this.message._id ||
				this.hoverMessageId === this.message._id
			)
		},
		isAudio() {
			return this.message.files?.some(file => isAudioFile(file))
		},
		isCheckmarkVisible() {
			return (
				this.message.senderId === this.currentUserId &&
				!this.message.deleted &&
				(this.message.saved || this.message.distributed || this.message.seen)
			)
		},
		hasCurrentUserAvatar() {
			return this.messages.some(
				message => message.senderId === this.currentUserId && message.avatar
			)
		},
		hasSenderUserAvatar() {
			return this.messages.some(
				message => message.senderId !== this.currentUserId && message.avatar
			)
		},
		isMessageSelected() {
			return (
				this.messageSelectionEnabled &&
				!!this.selectedMessages.find(
					message => message._id === this.message._id
				)
			)
		}
	},

	watch: {
		newMessages: {
			immediate: true,
			deep: true,
			handler(val) {
				if (!val.length || !this.showNewMessagesDivider) {
					this.newMessage = {}
					return
				}

				this.newMessage = val.reduce((res, obj) =>
					obj.index < res.index ? obj : res
				)
			}
		},
		messageSelectionEnabled() {
			this.resetMessageHover()
		}
	},

	mounted() {
		messagesValidation(this.message)

		this.$emit('message-added', {
			message: this.message,
			index: this.index,
			ref: this.$refs.message
		})

    const shouldTruncate = this.maxMessageRows <= 0 || this.message.replyMessage || !this.$refs.messageBox
    if (shouldTruncate) {
      this.hasTruncatedContent = false
      return
    }

    this.setMaxMessageRowsStyle()

    const lineHeight = window.getComputedStyle(this.$refs.messageBox).lineHeight
    const contentRows = Math.ceil(this.$refs.messageBox.clientHeight / parseFloat(lineHeight))

    this.hasTruncatedContent = contentRows > this.maxMessageRows
	},

	methods: {
		onHoverMessage() {
			if (!this.messageSelectionEnabled) {
				this.messageHover = !this.isSelectingContent && true
				if (this.canEditMessage()) this.hoverMessageId = this.message._id
			}
		},

		canEditMessage() {
			return !this.message.deleted
		},

		onLeaveMessage() {
			if (!this.messageSelectionEnabled) {
				if (!this.optionsOpened && !this.emojiOpened) this.messageHover = false
				this.hoverMessageId = null
			}
		},

		resetMessageHover() {
			this.messageHover = false
			this.hoverMessageId = null
		},

		openFile(file) {
			this.$emit('open-file', { message: this.message, file: file })
		},

		openUserTag(user) {
			this.$emit('open-user-tag', { user })
		},
    onClickMessageUsername() {
      const user = this.roomUsers.find(user => user._id === this.message.senderId)
      this.$emit('click-message-username', { user })
    },
		messageActionHandler(action) {
			this.resetMessageHover()

			setTimeout(() => {
				this.$emit('message-action-handler', { action, message: this.message })
			}, 300)
		},

		sendMessageReaction({ emoji, reaction }) {
			this.$emit('send-message-reaction', {
				messageId: this.message._id,
				reaction: emoji,
				remove: reaction && reaction.indexOf(this.currentUserId) !== -1
			})
			this.messageHover = false
		},

    messageReactionClick() {
      this.$emit('message-reaction-click', {
        messageId: this.message._id,
        userId: this.currentUserId
      })
    },

		selectMessage() {
      if (!this.messageSelectionEnabled || this.message.system) {
          return
      }
      if (this.isMessageSelected) {
        this.$emit('unselect-message', this.message._id)
        return
      }
      this.$emit('select-message', this.message)
		},

    startContentSelection() {
      this.isSelectingContent = true
      this.resetMessageHover()
    },

    endContentSelection() {
      this.hoverMessageId = this.message._id
      this.isSelectingContent = false
    },

    setMaxMessageRowsStyle() {
      const formatWrapper = this.$refs.messageBox.querySelector('.vac-format-message-wrapper')
      if (!formatWrapper) {
        return
      }

      formatWrapper.style.cssText = `
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: ${this.maxMessageRows};
        -webkit-box-orient: vertical;
      `
    },

    expandMessageContent() {
      this.hasTruncatedContent = false

      const formatWrapper = this.$refs.messageBox.querySelector('.vac-format-message-wrapper')
      if (!formatWrapper) {
        return
      }

      this.$nextTick(() => {
        formatWrapper.style.cssText = ''
      })
    }
	}
}
</script>
