<template>
	<div class="vac-room-file-container">
		<div
			class="vac-svg-button vac-icon-remove"
			@click="$emit('remove-file', index)"
		>
			<slot name="image-close-icon">
				<svg-icon name="close" param="image" />
			</slot>
		</div>

		<div
			v-if="isImage"
			class="vac-message-image"
			:style="{
				'background-image': `url('${file.localUrl || file.url}')`
			}"
		/>

		<video v-else-if="isVideo" controls>
			<source :src="file.localUrl || file.url" />
		</video>

		<div v-else class="vac-file-container">
			<div>
				<slot name="file-icon">
					<svg-icon name="file" />
				</slot>
			</div>
			<div class="vac-text-ellipsis">
				{{ file.name }}
			</div>
			<div v-if="file.extension" class="vac-text-ellipsis vac-text-extension">
				{{ file.extension }}
			</div>
		</div>
	</div>
</template>

<script>
import SvgIcon from '../../../components/SvgIcon/SvgIcon'

const { isImageFile, isVideoFile } = require('../../../utils/media-file')

export default {
	name: 'RoomFiles',
	components: {
		SvgIcon
	},

	props: {
		file: { type: Object, required: true },
		index: { type: Number, required: true }
	},

	emits: ['remove-file'],

	computed: {
		isImage() {
			return isImageFile(this.file)
		},
		isVideo() {
			return isVideoFile(this.file)
		}
	}
}
</script>
