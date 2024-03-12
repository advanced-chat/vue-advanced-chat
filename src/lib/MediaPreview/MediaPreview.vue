<template>
	<div
		ref="modal"
		tabindex="0"
		class="vac-media-preview"
		@keydown.esc="closeModal"
	>
		<transition name="vac-bounce-preview" appear>
			<div v-if="isImage" class="vac-media-preview-container">
				<div
					ref="imagePreview"
					class="vac-image-preview"
					:style="{
						'background-image': `url('${file.url}')`
					}"
				/>
			</div>

			<div v-else-if="isVideo" class="vac-media-preview-container">
				<video width="100%" height="100%" controls autoplay>
					<source :src="file.url" />
				</video>
			</div>
		</transition>
		<div class="vac-svg-button" @click="closeModal">
			<slot name="preview-close-icon">
				<svg-icon name="close-outline" param="preview" />
			</slot>
		</div>
	</div>
</template>
<script>
import SvgIcon from '../../components/SvgIcon/SvgIcon'

const { isImageFile, isVideoFile } = require('../../utils/media-file')

export default {
	name: 'MediaPreview',
	components: {
		SvgIcon
	},

	props: {
		file: { type: Object, required: true }
	},

	emits: ['close-media-preview'],
	data() {
		return {
			zoomLevel: 0,
			transformOriginX: 0,
			transformOriginY: 0,
			panning: false,
			startPoint: { x: 0, y: 0 },
			translation: { x: 0, y: 0 }
		}
	},

	computed: {
		isImage() {
			return isImageFile(this.file)
		},
		isVideo() {
			return isVideoFile(this.file)
		}
	},

	mounted() {
		this.$refs.modal.focus()
	},
	created() {
		window.addEventListener('wheel', this.handleWheel)
		window.addEventListener('mousemove', this.handleMouseMove)
		window.addEventListener('mousedown', this.handleMouseDown)
		window.addEventListener('mouseup', this.handleMouseUp)
	},
	destroyed() {
		window.removeEventListener('wheel', this.handleWheel)
		window.removeEventListener('mousemove', this.handleMouseMove)
		window.removeEventListener('mousedown', this.handleMouseDown)
		window.removeEventListener('mouseup', this.handleMouseUp)
	},
	methods: {
		closeModal() {
			this.$emit('close-media-preview')
		},
		handleMouseMove(e) {
			if (this.isImage) {
				let rect = this.$refs.imagePreview.getBoundingClientRect()
				this.transformOriginX = e.clientX - rect.left
				this.transformOriginY = e.clientY - rect.top
			}
			if (this.zoomLevel === 0) {
				this.$refs.imagePreview.style.transformOrigin = `${this.transformOriginX}px ${this.transformOriginY}px`
			}
			if (this.panning) {
				if (e.buttons !== 1) {
					this.panning = false
					return
				}
				let dx = e.clientX - this.startPoint.x
				let dy = e.clientY - this.startPoint.y
				this.startPoint = { x: e.clientX, y: e.clientY }
				this.translation = {
					x: this.translation.x + dx,
					y: this.translation.y + dy
				}
				this.$refs.imagePreview.style.transform = `translate(${
					this.translation.x
				}px, ${this.translation.y}px) scale(${1 + this.zoomLevel})`
			}
		},
		handleWheel(e) {
			if (this.isImage) {
				this.startPoint = { x: 0, y: 0 }
				this.translation = { x: 0, y: 0 }
				if (e.deltaY > 0) {
					if (this.zoomLevel > 0) {
						this.zoomLevel -= 0.1
					}
					if (this.zoomLevel < 0) {
						this.zoomLevel = 0
					}
				} else if (e.deltaY < 0) {
					this.zoomLevel += 0.1
				}
				this.$refs.imagePreview.style.transform = `scale(${1 + this.zoomLevel})`
			}
		},
		handleMouseDown(e) {
			let rect = this.$refs.imagePreview.getBoundingClientRect()
			if (
				e.clientX > rect.left &&
				e.clientX < rect.right &&
				e.clientY > rect.top &&
				e.clientY < rect.bottom
			) {
				if (this.zoomLevel > 0 && this.isImage) {
					this.panning = true
					this.startPoint = { x: e.clientX, y: e.clientY }
				}
			} else {
				this.closeModal()
			}
		},
		handleMouseUp(e) {
			this.panning = false
		}
	}
}
</script>
