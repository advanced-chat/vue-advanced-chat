<template>
	<transition name="vac-slide-up">
		<div
			v-if="files.length"
			class="vac-room-files-container"
			:style="{ bottom: `${footerHeight}px` }"
		>
			<div class="vac-files-box">
				<div v-for="(file, i) in files" :key="i">
					<room-file
						:file="file"
						:index="i"
						@remove-file="$emit('remove-file', $event)"
					/>
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
import SvgIcon from '../../../../components/SvgIcon/SvgIcon'

import RoomFile from './RoomFile/RoomFile'

export default {
	name: 'RoomFiles',
	components: {
		SvgIcon,
		RoomFile
	},

	props: {
		files: { type: Array, required: true }
	},

	emits: ['remove-file', 'reset-message'],

	computed: {
		footerHeight() {
			return document.getElementById('room-footer').clientHeight
		}
	}
}
</script>
