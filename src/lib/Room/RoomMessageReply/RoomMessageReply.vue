<template>
	<transition name="vac-slide-up">
		<div
			v-if="messageReply"
			class="vac-reply-container"
			:style="{ bottom: `${$parent.$refs.roomFooter.clientHeight}px` }"
		>
			<div class="vac-reply-box">
				<div class="vac-reply-info">
					<div class="vac-reply-username">
						{{ messageReply.username }}
					</div>
					<div class="vac-reply-content">
						<format-message
							:content="messageReply.content"
							:users="room.users"
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

				<img
					v-if="isImageFile"
					:src="messageReply.file.url"
					class="vac-image-reply"
				/>
				<video v-else-if="isVideoFile" controls class="vac-image-reply">
					<source :src="messageReply.file.url" />
				</video>
				<audio-player
					v-else-if="isAudioFile"
					:src="messageReply.file.url"
					class="vac-audio-reply"
				>
					<template v-for="(i, name) in $scopedSlots" #[name]="data">
						<slot :name="name" v-bind="data" />
					</template>
				</audio-player>
			</div>

			<div class="vac-icon-reply">
				<div class="vac-svg-button" @click="$emit('reset-message')">
					<slot name="reply-close-icon">
						<svg-icon name="close-outline" />
					</slot>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import SvgIcon from '../../../components/SvgIcon/SvgIcon'
import FormatMessage from '../../../components/FormatMessage/FormatMessage'

import AudioPlayer from '../../Message/AudioPlayer/AudioPlayer'

const {
	isAudioFile,
	isImageFile,
	isVideoFile
} = require('../../../utils/media-file')

export default {
	name: 'RoomMessageReply',
	components: {
		SvgIcon,
		FormatMessage,
		AudioPlayer
	},

	props: {
		room: { type: Object, required: true },
		messageReply: { type: Object, default: null },
		textFormatting: { type: Boolean, required: true },
		linkOptions: { type: Object, required: true }
	},

	computed: {
		isImageFile() {
			return isImageFile(this.messageReply.file)
		},
		isVideoFile() {
			return isVideoFile(this.messageReply.file)
		},
		isAudioFile() {
			return isAudioFile(this.messageReply.file)
		}
	}
}
</script>
