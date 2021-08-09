<template>
	<transition name="vac-slide-up">
		<div
			v-if="files.length"
			class="vac-files-container vac-app-box-shadow"
			:style="{ bottom: `${$parent.$refs.roomFooter.clientHeight}px` }"
		>
			<div class="vac-files-box">
				<div v-for="(file, i) in files" :key="i">
					<div class="vac-media-container">
						<div
							class="vac-svg-button vac-icon-remove"
							@click="$emit('remove-file', i)"
						>
							<slot name="image-close-icon">
								<svg-icon name="close" param="image" />
							</slot>
						</div>

						<div
							v-if="isImageFile(file)"
							class="vac-message-image"
							:style="{
								'background-image': `url('${file.localUrl || file.url}')`
							}"
						/>

						<video v-else-if="isVideoFile(file)" controls>
							<source :src="file.localUrl || file.url" />
						</video>

						<div v-else class="vac-file-container">
							<div class="vac-icon-file">
								<slot name="file-icon">
									<svg-icon name="file" />
								</slot>
							</div>
							<div class="vac-text-ellipsis">
								{{ file.name }}
							</div>
							<div
								v-if="file.extension"
								class="vac-text-ellipsis vac-text-extension"
							>
								{{ file.extension }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="vac-icon-close">
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

const { isImageFile, isVideoFile } = require('../../../utils/media-file')

export default {
	name: 'RoomFiles',
	components: {
		SvgIcon
	},

	props: {
		files: { type: Array, required: true }
	},

	emits: ['remove-file', 'reset-message'],

	methods: {
		isImageFile(file) {
			return isImageFile(file)
		},
		isVideoFile(file) {
			return isVideoFile(file)
		}
	}
}
</script>
