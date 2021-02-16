<template>
	<div :ref="refId" class="vac-line-container" @mousedown="onMouseDown">
		<div class="vac-line-progress" :style="calculateSize" />
	</div>
</template>

<script>
export default {
	props: {
		refId: { type: String, default: null },
		percentage: { type: Number, default: 0 }
	},

	computed: {
		calculateSize() {
			const value =
				this.percentage < 1 ? this.percentage * 100 : this.percentage

			return `width: ${value}%`
		}
	},

	methods: {
		onMouseDown(ev) {
			const seekPos = this.calculateLineHeadPosition(ev, this.$refs[this.refId])
			this.$emit('change-linehead', seekPos)
			document.addEventListener('mousemove', this.onMouseMove)
			document.addEventListener('mouseup', this.onMouseUp)
		},
		onMouseUp(ev) {
			document.removeEventListener('mouseup', this.onMouseUp)
			document.removeEventListener('mousemove', this.onMouseMove)
			const seekPos = this.calculateLineHeadPosition(ev, this.$refs[this.refId])
			this.$emit('change-linehead', seekPos)
		},
		onMouseMove(ev) {
			const seekPos = this.calculateLineHeadPosition(ev, this.$refs[this.refId])
			this.$emit('change-linehead', seekPos)
		},
		calculateLineHeadPosition(ev, element) {
			const progressWidth = element.getBoundingClientRect().width
			const leftPosition = ev.target.getBoundingClientRect().left
			let pos = (ev.clientX - leftPosition) / progressWidth

			pos = pos < 0 ? 0 : pos
			pos = pos > 1 ? 1 : pos

			return pos
		}
	}
}
</script>

<style lang="scss">
.vac-line-container {
	position: relative;
	height: 8px;
	border-radius: 5px;
	background-color: var(--chat-message-bg-color-audio-line);

	.vac-line-progress {
		position: absolute;
		height: inherit;
		background-color: var(--chat-message-bg-color-audio-progress);
		border-radius: inherit;
	}
}
</style>
