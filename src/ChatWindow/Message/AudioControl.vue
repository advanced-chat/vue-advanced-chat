<template>
	<div
		ref="progress"
		class="vac-player-bar"
		@mousedown="onMouseDown"
		@mouseover="$emit('hover-audio-progress', true)"
		@mouseout="$emit('hover-audio-progress', false)"
	>
		<div class="vac-player-progress">
			<div class="vac-line-container">
				<div class="vac-line-progress" :style="{ width: `${percentage}%` }" />
				<div
					class="vac-line-dot"
					:class="{ 'vac-line-dot__active': isMouseDown }"
					:style="{ left: `${percentage}%` }"
				/>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		percentage: { type: Number, default: 0 }
	},

	data() {
		return {
			isMouseDown: false
		}
	},

	methods: {
		onMouseDown(ev) {
			this.isMouseDown = true
			const seekPos = this.calculateLineHeadPosition(ev, this.$refs['progress'])
			this.$emit('change-linehead', seekPos)
			document.addEventListener('mousemove', this.onMouseMove)
			document.addEventListener('mouseup', this.onMouseUp)
		},
		onMouseUp(ev) {
			this.isMouseDown = false
			document.removeEventListener('mouseup', this.onMouseUp)
			document.removeEventListener('mousemove', this.onMouseMove)
			const seekPos = this.calculateLineHeadPosition(ev, this.$refs['progress'])
			this.$emit('change-linehead', seekPos)
		},
		onMouseMove(ev) {
			const seekPos = this.calculateLineHeadPosition(ev, this.$refs['progress'])
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
	margin-right: 7px;
	margin-left: 20px;

	.vac-player-progress {
		width: 190px;

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
				top: -5px;
				margin-left: -7px;
				height: 14px;
				width: 14px;
				border-radius: 50%;
				background-color: var(--chat-message-bg-color-audio-progress-selector);
				transition: transform 0.25s;

				&__active {
					transform: scale(1.2);
				}
			}
		}
	}
}

@media only screen and (max-width: 768px) {
	.vac-player-bar {
		margin-right: 5px;

		.vac-player-progress .vac-line-container {
			height: 3px;

			.vac-line-dot {
				height: 12px;
				width: 12px;
				top: -5px;
				margin-left: -5px;
			}
		}
	}
}
</style>
