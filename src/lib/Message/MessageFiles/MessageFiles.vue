<template>
	<div ref="imageRef" class="vac-image-container">
		<div v-for="(file, i) in message.files" :key="i">
			<div v-if="isImage(file)">
				<loader
					:style="{ top: `${imageResponsive.loaderTop}px` }"
					:show="isImageLoading"
				/>
				<div
					class="vac-message-image"
					:class="{
						'vac-image-loading':
							isImageLoading && message.senderId === currentUserId
					}"
					:style="{
						'background-image': `url('${
							isImageLoading ? file.preview || file.url : file.url
						}')`,
						'max-height': `${imageResponsive.maxHeight}px`
					}"
				>
					<transition name="vac-fade-image">
						<div v-if="imageHover && !isImageLoading" class="vac-image-buttons">
							<div
								class="vac-svg-button vac-button-view"
								@click.stop="openFile(file, 'preview')"
							>
								<slot name="eye-icon">
									<svg-icon name="eye" />
								</slot>
							</div>
							<div
								class="vac-svg-button vac-button-download"
								@click.stop="openFile(file, 'download')"
							>
								<slot name="document-icon">
									<svg-icon name="document" />
								</slot>
							</div>
						</div>
					</transition>
				</div>
			</div>

			<div v-else-if="isVideo(file)" class="vac-video-container">
				<video width="100%" height="100%" controls>
					<source :src="file.url" />
				</video>
			</div>

			<div
				v-else
				class="vac-file-message"
				@click.stop="openFile(file, 'download')"
			>
				<div class="vac-svg-button">
					<slot name="document-icon">
						<svg-icon name="document" />
					</slot>
				</div>
				<div class="vac-text-ellipsis">
					{{ file.name }}
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
import Loader from '../../../components/Loader/Loader'
import SvgIcon from '../../../components/SvgIcon/SvgIcon'
import FormatMessage from '../../../components/FormatMessage/FormatMessage'

const { isImageFile, isVideoFile } = require('../../../utils/media-file')

export default {
	name: 'MessageFiles',
	components: { SvgIcon, Loader, FormatMessage },

	props: {
		currentUserId: { type: [String, Number], required: true },
		message: { type: Object, required: true },
		roomUsers: { type: Array, required: true },
		textFormatting: { type: Boolean, required: true },
		linkOptions: { type: Object, required: true },
		imageHover: { type: Boolean, required: true }
	},

	emits: ['open-file', 'open-user-tag'],

	data() {
		return {
			imageLoading: false,
			imageResponsive: ''
		}
	},

	computed: {
		isImageLoading() {
			return (
				this.message.files.some(file => {
					return file.url.indexOf('blob:http') !== -1
				}) || this.imageLoading
			)
		}
	},

	watch: {
		message: {
			immediate: true,
			handler() {
				this.checkImgLoad()
			}
		}
	},

	mounted() {
		this.imageResponsive = {
			maxHeight: this.$refs.imageRef.clientWidth - 18,
			loaderTop: this.$refs.imageRef.clientWidth / 2
		}
	},

	methods: {
		checkImgLoad() {
			if (!isImageFile(this.message.file)) return
			this.imageLoading = true
			const image = new Image()
			image.src = this.message.file.url
			image.addEventListener('load', () => (this.imageLoading = false))
		},
		isImage(file) {
			return isImageFile(file)
		},
		isVideo(file) {
			return isVideoFile(file)
		},
		openFile(file, action) {
			this.$emit('open-file', { file, action })
		}
	}
}
</script>
