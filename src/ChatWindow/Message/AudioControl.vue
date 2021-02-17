<template>
	<div
		:ref="refId"
		class="vac-player-bar"
		@mousedown="onMouseDown"
		@mouseover="$emit('hover-audio-progress', true)"
		@mouseout="$emit('hover-audio-progress', false)"
	>
		<div class="vac-player-progress">
			<div class="vac-line-container">
				<div class="vac-line-progress" :style="{ width: calculateSize }" />
				<div
					class="vac-line-dot"
					:class="{ 'vac-line-dot__active': isMouseDown }"
					:style="{ left: calculateSize }"
				/>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		refId: { type: String, default: null },
		percentage: { type: Number, default: 0 }
	},

	data() {
		return {
			isMouseDown: false
		}
	},

	computed: {
		calculateSize() {
			return this.percentage < 1 ? this.percentage * 100 : this.percentage + '%'
		}
	},

	methods: {
		onMouseDown(ev) {
			this.isMouseDown = true
			const seekPos = this.calculateLineHeadPosition(ev, this.$refs[this.refId])
			this.$emit('change-linehead', seekPos)
			document.addEventListener('mousemove', this.onMouseMove)
			document.addEventListener('mouseup', this.onMouseUp)
		},
		onMouseUp(ev) {
			this.isMouseDown = false
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
			const leftPosition = element.getBoundingClientRect().left
			let pos = (ev.clientX - leftPosition) / progressWidth

			pos = pos < 0 ? 0 : pos
			pos = pos > 1 ? 1 : pos

			return pos
		}
	}
}
</script>

<style lang="scss">
.vac-player-bar {
	display: flex;
	align-items: center;
	max-width: calc(100% - 18px);

	.vac-player-progress {
		width: 200px;
		margin: 0 4px 0 14px;
	}
}

.vac-line-container {
	position: relative;
	height: 4px;
	border-radius: 5px;
	background-color: var(--chat-message-bg-color-audio-line);

	.vac-line-progress {
		position: absolute;
		height: inherit;
		background-color: var(--chat-message-bg-color-audio-progress);
		border-radius: inherit;
	}

	.vac-line-dot {
		position: absolute;
		top: -6px;
		margin-left: -8px;
		height: 15px;
		width: 15px;
		border-radius: 50%;
		background-color: var(--chat-message-bg-color-audio-progress-selector);
		transition: transform 0.25s;

		&__active {
			transform: scale(1.2);
		}
	}
}
</style>
