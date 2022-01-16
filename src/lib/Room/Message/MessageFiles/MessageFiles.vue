<template>
	<div class="vac-message-files-container">
		<div v-for="(file, idx) in imageVideoFiles" :key="idx + 'iv'">
			<message-file
				:file="file"
				:current-user-id="currentUserId"
				:message="message"
				:index="idx"
				:message-selection-enabled="messageSelectionEnabled"
				@open-file="$emit('open-file', $event)"
			>
				<template v-for="(i, name) in $scopedSlots" #[name]="data">
					<slot :name="name" v-bind="data" />
				</template>
			</message-file>
		</div>

		<div
			v-for="(file, idx) in otherFiles"
			:key="idx + 'a'"
			class="vac-file-wrapper"
		>
			<progress-bar
				v-if="file.progress >= 0"
				:progress="file.progress"
				:style="{ top: '44px' }"
			/>
			<div
				class="vac-file-container"
				:class="{ 'vac-file-container-progress': file.progress >= 0 }"
				@click="openFile($event, file, 'download')"
			>
				<div class="vac-svg-button">
					<slot name="document-icon">
						<svg-icon name="document" />
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

		<format-message
			:content="message.content"
			:users="roomUsers"
			:text-formatting="textFormatting"
			:link-options="linkOptions"
			@open-user-tag="$emit('open-user-tag')"
		>
			<template v-for="(i, name) in $scopedSlots" #[name]="data">
				<slot :name="name" v-bind="data" />
			</template>
		</format-message>
	</div>
</template>

<script>
import SvgIcon from '../../../../components/SvgIcon/SvgIcon'
import FormatMessage from '../../../../components/FormatMessage/FormatMessage'
import ProgressBar from '../../../../components/ProgressBar/ProgressBar'

import MessageFile from './MessageFile/MessageFile'

const { isImageVideoFile } = require('../../../../utils/media-file')

export default {
	name: 'MessageFiles',
	components: { SvgIcon, FormatMessage, ProgressBar, MessageFile },

	props: {
		currentUserId: { type: [String, Number], required: true },
		message: { type: Object, required: true },
		roomUsers: { type: Array, required: true },
		textFormatting: { type: Object, required: true },
		linkOptions: { type: Object, required: true },
		messageSelectionEnabled: { type: Boolean, required: true }
	},

	emits: ['open-file', 'open-user-tag'],

	computed: {
		imageVideoFiles() {
			return this.message.files.filter(file => isImageVideoFile(file))
		},
		otherFiles() {
			return this.message.files.filter(file => !isImageVideoFile(file))
		}
	},

	methods: {
		openFile(event, file, action) {
			if (!this.messageSelectionEnabled) {
				event.stopPropagation()
				this.$emit('open-file', { file, action })
			}
		}
	}
}
</script>
