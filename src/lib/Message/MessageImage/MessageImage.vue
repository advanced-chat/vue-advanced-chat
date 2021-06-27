<template>
	<div ref="imageRef" class="vac-image-container">
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
				'background-image': `url('${imageBackground}')`,
				'max-height': `${imageResponsive.maxHeight}px`
			}"
		>
			<transition name="vac-fade-image">
				<div v-if="imageHover && !isImageLoading" class="vac-image-buttons">
					<div
						class="vac-svg-button vac-button-view"
						@click.stop="$emit('open-file', 'preview')"
					>
						<slot name="eye-icon">
							<svg-icon name="eye" />
						</slot>
					</div>
					<div
						class="vac-svg-button vac-button-download"
						@click.stop="$emit('open-file', 'download')"
					>
						<slot name="document-icon">
							<svg-icon name="document" />
						</slot>
					</div>
				</div>
			</transition>
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

const { isImageFile } = require('../../../utils/media-file')

export default {
	name: 'MessageImage',
	components: { SvgIcon, Loader, FormatMessage },

	props: {
		currentUserId: { type: [String, Number], required: true },
		message: { type: Object, required: true },
		roomUsers: { type: Array, required: true },
		textFormatting: { type: Boolean, required: true },
		linkOptions: { type: Object, required: true },
		imageHover: { type: Boolean, required: true }
	},

	data() {
		return {
			imageLoading: false,
			imageResponsive: ''
		}
	},

	computed: {
		isImageLoading() {
			return (
				this.message.file.url.indexOf('blob:http') !== -1 || this.imageLoading
			)
		},
		imageBackground() {
			return this.isImageLoading
				? this.message.file.preview || this.message.file.url
				: this.message.file.url
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
		}
	}
}
</script>
