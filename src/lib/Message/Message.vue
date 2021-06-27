<template>
	<div :id="message._id" :ref="message._id" class="vac-message-wrapper">
		<div v-if="showDate" class="vac-card-info vac-card-date">
			{{ message.date }}
		</div>

		<div v-if="newMessage._id === message._id" class="vac-line-new">
			{{ textMessages.NEW_MESSAGES }}
		</div>

		<div v-if="message.system" class="vac-card-info vac-card-system">
			<format-message
				:content="message.content"
				:users="roomUsers"
				:text-formatting="textFormatting"
				:link-options="linkOptions"
				@open-user-tag="openUserTag"
			>
				<template v-for="(i, name) in $scopedSlots" #[name]="data">
					<slot :name="name" v-bind="data" />
				</template>
			</format-message>
		</div>

		<div
			v-else
			class="vac-message-box"
			:class="{ 'vac-offset-current': message.senderId === currentUserId }"
		>
			<slot name="message" v-bind="{ message }">
				<div
					v-if="message.avatar && message.senderId !== currentUserId"
					class="vac-avatar"
					:style="{ 'background-image': `url('${message.avatar}')` }"
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
							'vac-message-deleted': message.deleted
						}"
						@mouseover="onHoverMessage"
						@mouseleave="onLeaveMessage"
					>
						<div
							v-if="roomUsers.length > 2 && message.senderId !== currentUserId"
							class="vac-text-username"
							:class="{
								'vac-username-reply': !message.deleted && message.replyMessage
							}"
						>
							<span>{{ message.username }}</span>
						</div>

						<message-reply
							v-if="!message.deleted && message.replyMessage"
							:message="message"
							:room-users="roomUsers"
							:text-formatting="textFormatting"
							:link-options="linkOptions"
						>
							<template v-for="(i, name) in $scopedSlots" #[name]="data">
								<slot :name="name" v-bind="data" />
							</template>
						</message-reply>

						<div v-if="message.deleted">
							<slot name="deleted-icon">
								<svg-icon name="deleted" class="vac-icon-deleted" />
							</slot>
							<span>{{ textMessages.MESSAGE_DELETED }}</span>
						</div>

						<format-message
							v-else-if="!message.file"
							:content="message.content"
							:users="roomUsers"
							:text-formatting="textFormatting"
							:link-options="linkOptions"
							@open-user-tag="openUserTag"
						>
							<template v-for="(i, name) in $scopedSlots" #[name]="data">
								<slot :name="name" v-bind="data" />
							</template>
						</format-message>

						<message-image
							v-else-if="isImage"
							:current-user-id="currentUserId"
							:message="message"
							:room-users="roomUsers"
							:text-formatting="textFormatting"
							:link-options="linkOptions"
							:image-hover="imageHover"
							@open-file="openFile"
						>
							<template v-for="(i, name) in $scopedSlots" #[name]="data">
								<slot :name="name" v-bind="data" />
							</template>
						</message-image>

						<div v-else-if="isVideo" class="vac-video-container">
							<video width="100%" height="100%" controls>
								<source :src="message.file.url" />
							</video>
							<format-message
								:content="message.content"
								:users="roomUsers"
								:text-formatting="textFormatting"
								:link-options="linkOptions"
								@open-user-tag="openUserTag"
							>
								<template v-for="(i, name) in $scopedSlots" #[name]="data">
									<slot :name="name" v-bind="data" />
								</template>
							</format-message>
						</div>

						<audio-player
							v-else-if="isAudio"
							:src="message.file.url"
							@update-progress-time="progressTime = $event"
							@hover-audio-progress="hoverAudioProgress = $event"
						>
							<template v-for="(i, name) in $scopedSlots" #[name]="data">
								<slot :name="name" v-bind="data" />
							</template>
						</audio-player>

						<div v-else class="vac-file-message">
							<div
								class="vac-svg-button vac-icon-file"
								@click.stop="openFile('download')"
							>
								<slot name="document-icon">
									<svg-icon name="document" />
								</slot>
							</div>
							<span>{{ message.content }}</span>
						</div>

						<div v-if="isAudio && !message.deleted" class="vac-progress-time">
							{{ progressTime }}
						</div>

						<div class="vac-text-timestamp">
							<div
								v-if="message.edited && !message.deleted"
								class="vac-icon-edited"
							>
								<slot name="pencil-icon">
									<svg-icon name="pencil" />
								</slot>
							</div>
							<span>{{ message.timestamp }}</span>
							<span v-if="isCheckmarkVisible">
								<slot name="checkmark-icon" v-bind="{ message }">
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
							:room-footer-ref="roomFooterRef"
							:show-reaction-emojis="showReactionEmojis"
							:hide-options="hideOptions"
							:message-hover="messageHover"
							:hover-message-id="hoverMessageId"
							:hover-audio-progress="hoverAudioProgress"
							@hide-options="$emit('hide-options', false)"
							@update-message-hover="messageHover = $event"
							@update-options-opened="optionsOpened = $event"
							@update-emoji-opened="emojiOpened = $event"
							@message-action-handler="messageActionHandler"
							@send-message-reaction="sendMessageReaction($event)"
						>
							<template v-for="(i, name) in $scopedSlots" #[name]="data">
								<slot :name="name" v-bind="data" />
							</template>
						</message-actions>
					</div>

					<message-reactions
						:current-user-id="currentUserId"
						:message="message"
						:emojis-list="emojisList"
						@send-message-reaction="sendMessageReaction($event)"
					/>
				</div>
			</slot>
		</div>
	</div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon/SvgIcon'
import FormatMessage from '../../components/FormatMessage/FormatMessage'

import MessageReply from './MessageReply/MessageReply'
import MessageImage from './MessageImage/MessageImage'
import MessageActions from './MessageActions/MessageActions'
import MessageReactions from './MessageReactions/MessageReactions'
import AudioPlayer from './AudioPlayer/AudioPlayer'

const { messagesValidation } = require('../../utils/data-validation')
const {
	isImageFile,
	isVideoFile,
	isAudioFile
} = require('../../utils/media-file')

export default {
	name: 'Message',
	components: {
		SvgIcon,
		FormatMessage,
		AudioPlayer,
		MessageReply,
		MessageImage,
		MessageActions,
		MessageReactions
	},

	props: {
		currentUserId: { type: [String, Number], required: true },
		textMessages: { type: Object, required: true },
		index: { type: Number, required: true },
		message: { type: Object, required: true },
		messages: { type: Array, required: true },
		editedMessage: { type: Object, required: true },
		roomUsers: { type: Array, default: () => [] },
		messageActions: { type: Array, required: true },
		roomFooterRef: { type: HTMLDivElement, default: null },
		newMessages: { type: Array, default: () => [] },
		showReactionEmojis: { type: Boolean, required: true },
		showNewMessagesDivider: { type: Boolean, required: true },
		textFormatting: { type: Boolean, required: true },
		linkOptions: { type: Object, required: true },
		emojisList: { type: Object, required: true },
		hideOptions: { type: Boolean, required: true }
	},

	data() {
		return {
			hoverMessageId: null,
			imageHover: false,
			messageHover: false,
			optionsOpened: false,
			emojiOpened: false,
			newMessage: {},
			progressTime: '- : -',
			hoverAudioProgress: false
		}
	},

	computed: {
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
				this.editedMessage._id === this.message._id ||
				this.hoverMessageId === this.message._id
			)
		},
		isImage() {
			return isImageFile(this.message.file)
		},
		isVideo() {
			return isVideoFile(this.message.file)
		},
		isAudio() {
			return isAudioFile(this.message.file)
		},
		isCheckmarkVisible() {
			return (
				this.message.senderId === this.currentUserId &&
				!this.message.deleted &&
				(this.message.saved || this.message.distributed || this.message.seen)
			)
		}
	},

	watch: {
		newMessages: {
			immediate: true,
			handler(val) {
				if (!val.length || !this.showNewMessagesDivider) {
					return (this.newMessage = {})
				}

				this.newMessage = val.reduce((res, obj) =>
					obj.index < res.index ? obj : res
				)
			}
		}
	},

	mounted() {
		messagesValidation(this.message)

		this.$emit('message-added', {
			message: this.message,
			index: this.index,
			ref: this.$refs[this.message._id]
		})
	},

	methods: {
		onHoverMessage() {
			this.imageHover = true
			this.messageHover = true
			if (this.canEditMessage()) this.hoverMessageId = this.message._id
		},
		canEditMessage() {
			return !this.message.deleted
		},
		onLeaveMessage() {
			this.imageHover = false
			if (!this.optionsOpened && !this.emojiOpened) this.messageHover = false
			this.hoverMessageId = null
		},
		openFile(action) {
			this.$emit('open-file', { message: this.message, action })
		},
		openUserTag(user) {
			this.$emit('open-user-tag', { user })
		},
		messageActionHandler(action) {
			this.messageHover = false
			this.hoverMessageId = null

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
		}
	}
}
</script>
