<template>
	<transition name="vac-slide-up">
		<div
			v-if="messageReply"
			class="vac-reply-container"
			:style="{ bottom: `${footerHeight}px` }"
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

				<img v-if="isImage" :src="firstFile.url" class="vac-image-reply" />

				<video v-else-if="isVideo" controls class="vac-image-reply">
					<source :src="firstFile.url" />
				</video>

				<audio-player
					v-else-if="isAudio"
					:src="firstFile.url"
					class="vac-audio-reply"
				>
					<template v-for="(i, name) in $scopedSlots" #[name]="data">
						<slot :name="name" v-bind="data" />
					</template>
				</audio-player>

				<div v-else-if="isOtherFile" class="vac-image-reply vac-file-container">
					<div>
						<slot name="file-icon">
							<svg-icon name="file" />
						</slot>
					</div>
					<div class="vac-text-ellipsis">
						{{ firstFile.name }}
					</div>
					<div
						v-if="firstFile.extension"
						class="vac-text-ellipsis vac-text-extension"
					>
						{{ firstFile.extension }}
					</div>
				</div>
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
import SvgIcon from '../../../../components/SvgIcon/SvgIcon'
import FormatMessage from '../../../../components/FormatMessage/FormatMessage'

import AudioPlayer from '../../RoomMessage/AudioPlayer/AudioPlayer'

const {
	isAudioFile,
	isImageFile,
	isVideoFile
} = require('../../../../utils/media-file')

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
		textFormatting: { type: Object, required: true },
		linkOptions: { type: Object, required: true }
	},

	emits: ['reset-message'],

	computed: {
		footerHeight() {
			return document.getElementById('room-footer').clientHeight
		},
		firstFile() {
			return this.messageReply.files?.length ? this.messageReply.files[0] : {}
		},
		isImage() {
			return isImageFile(this.firstFile)
		},
		isVideo() {
			return isVideoFile(this.firstFile)
		},
		isAudio() {
			return isAudioFile(this.firstFile)
		},
		isOtherFile() {
			return (
				this.messageReply.files?.length &&
				!this.isAudio &&
				!this.isVideo &&
				!this.isImage
			)
		}
	}
}
</script>
