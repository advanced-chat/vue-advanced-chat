<template>
	<div class="vac-room-file-preview">
		<div
			v-if="isImage"
			class="vac-room-file-preview-container"
			@click.stop="$emit('close-file-modal')"
			@keypress.esc="$emit('close-file-modal')"
		>
			<div
				class="vac-image-preview"
				:style="{
					'background-image': `url('${file.url}')`
				}"
				@keypress.esc="$emit('close-file-modal')"
			/>
		</div>

		<div
			v-else-if="isVideo"
			class="vac-video-preview"
			@keypress.esc="$emit('close-file-modal')"
		>
			<video width="100%" height="100%" controls>
				<source :src="file.url" />
			</video>
		</div>
		<button @click="$emit('close-file-modal')">
			Close
		</button>
	</div>
</template>
<script>
// import SvgIcon from '../../../components/SvgIcon/SvgIcon'

const { isImageFile, isVideoFile } = require('../../utils/media-file')

export default {
	name: 'RoomFilePreview',
	components: {
		// SvgIcon,
	},

	props: {
		file: { type: Object, required: true }
	},

	emits: ['open-file'],

	computed: {
		isImage() {
			return isImageFile(this.file)
		},
		isVideo() {
			if (this.file.url) return isVideoFile(this.file)
			else return false
		}
	}
}
</script>
