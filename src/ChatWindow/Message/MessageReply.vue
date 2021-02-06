<template>
	<div class="vac-reply-message">
		<div class="vac-reply-username">{{ replyUsername }}</div>

		<div class="vac-image-reply-container" v-if="isImage">
			<div
				class="vac-message-image vac-message-image-reply"
				:style="{
					'background-image': `url('${message.replyMessage.file.url}')`
				}"
			></div>
		</div>

		<div class="vac-reply-content">
			<format-message
				:content="message.replyMessage.content"
				:users="roomUsers"
				:text-formatting="true"
				:reply="true"
			>
			</format-message>
		</div>
	</div>
</template>

<script>
import FormatMessage from '../../components/FormatMessage'

const { isImageFile } = require('../../utils/mediaFile')

export default {
	name: 'message-reply',
	components: { FormatMessage },

	props: {
		message: { type: Object, required: true },
		roomUsers: { type: Array, required: true }
	},

	computed: {
		replyUsername() {
			const { sender_id } = this.message.replyMessage
			const replyUser = this.roomUsers.find(user => user._id === sender_id)
			return replyUser ? replyUser.username : ''
		},
		isImage() {
			return isImageFile(this.message.replyMessage.file)
		}
	},

	methods: {}
}
</script>

<style lang="scss" scoped>
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

	.vac-reply-content {
		font-size: 12px;
		color: var(--chat-message-color-reply-content);
	}
}
</style>
