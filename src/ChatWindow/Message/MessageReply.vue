<template>
	<div class="vac-reply-message">
		<div class="vac-reply-username">
			{{ replyUsername }}
		</div>

		<div v-if="isImage" class="vac-image-reply-container">
			<div
				class="vac-message-image vac-message-image-reply"
				:style="{
					'background-image': `url('${message.replyMessage.file.url}')`
				}"
			/>
		</div>

		<div v-else-if="isVideo" class="vac-video-reply-container">
			<video width="100%" height="100%" controls>
				<source :src="message.replyMessage.file.url" />
			</video>
		</div>

		<audio-player
			v-else-if="isAudio"
			:src="message.replyMessage.file.url"
			@update-progress-time="progressTime = $event"
			@hover-audio-progress="hoverAudioProgress = $event"
		>
			<template v-for="(i, name) in $scopedSlots" #[name]="data">
				<slot :name="name" v-bind="data" />
			</template>
		</audio-player>

		<div class="vac-reply-content">
			<format-message
				:content="message.replyMessage.content"
				:users="roomUsers"
				:text-formatting="textFormatting"
				:link-options="linkOptions"
				:reply="true"
			>
				<template v-for="(i, name) in $scopedSlots" #[name]="data">
					<slot :name="name" v-bind="data" />
				</template>
			</format-message>
		</div>
	</div>
</template>

<script>
import FormatMessage from '../../components/FormatMessage'
import AudioPlayer from './AudioPlayer'

const {
	isAudioFile,
	isImageFile,
	isVideoFile
} = require('../../utils/media-file')

export default {
	name: 'MessageReply',
	components: { AudioPlayer, FormatMessage },

	props: {
		message: { type: Object, required: true },
		textFormatting: { type: Boolean, required: true },
		linkOptions: { type: Object, required: true },
		roomUsers: { type: Array, required: true }
	},

	computed: {
		replyUsername() {
			const { senderId } = this.message.replyMessage
			const replyUser = this.roomUsers.find(user => user._id === senderId)
			return replyUser ? replyUser.username : ''
		},
		isAudio() {
			return isAudioFile(this.message.replyMessage.file)
		},
		isImage() {
			return isImageFile(this.message.replyMessage.file)
		},
		isVideo() {
			return isVideoFile(this.message.replyMessage.file)
		}
	}
}
</script>

<style lang="scss">
.vac-reply-message {
	background: var(--chat-message-bg-color-reply);
	border-radius: 4px;
	margin: -1px -5px 8px;
	padding: 8px 10px;

	.vac-reply-username {
		color: var(--chat-message-color-reply-username);
		font-size: 12px;
		line-height: 15px;
		margin-bottom: 2px;
	}

	.vac-image-reply-container {
		width: 70px;

		.vac-message-image-reply {
			height: 70px;
			width: 70px;
			margin: 4px auto 3px;
		}
	}

	.vac-video-reply-container {
		width: 200px;
		max-width: 100%;

		video {
			border-radius: 4px;
		}
	}

	.vac-reply-content {
		font-size: 12px;
		color: var(--chat-message-color-reply-content);
	}
}
</style>
