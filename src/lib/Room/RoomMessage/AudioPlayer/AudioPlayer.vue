<template>
	<div>
		<div class="vac-audio-player">
			<div class="vac-svg-button" @click="playback">
				<slot v-if="isPlaying" name="audio-pause-icon">
					<svg-icon name="audio-pause" />
				</slot>
				<slot v-else name="audio-play-icon">
					<svg-icon name="audio-play" />
				</slot>
			</div>
			<audio-control
				:percentage="progress"
				:message-selection-enabled="messageSelectionEnabled"
				@change-linehead="onUpdateProgress"
				@hover-audio-progress="$emit('hover-audio-progress', $event)"
			/>

			<audio :id="playerUniqId" :src="audioSource" />
		</div>
	</div>
</template>

<script>
import SvgIcon from '../../../../components/SvgIcon/SvgIcon'

import AudioControl from './AudioControl/AudioControl'

export default {
	name: 'AudioPlayer',
	components: {
		SvgIcon,
		AudioControl
	},

	props: {
		messageId: { type: [String, Number], default: null },
		src: { type: String, default: null },
		messageSelectionEnabled: { type: Boolean, required: true }
	},

	emits: ['hover-audio-progress', 'update-progress-time'],

	data() {
		return {
			isPlaying: false,
			duration: this.convertTimeMMSS(0),
			playedTime: this.convertTimeMMSS(0),
			progress: 0
		}
	},

	computed: {
		playerUniqId() {
			return `audio-player${this.messageId}`
		},
		audioSource() {
			if (this.src) return this.src
			this.resetProgress()
			return null
		}
	},

	mounted() {
		this.player = document.getElementById(this.playerUniqId)

		this.player.addEventListener('ended', () => {
			this.isPlaying = false
		})

		this.player.addEventListener('loadeddata', () => {
			this.resetProgress()
			this.duration = this.convertTimeMMSS(this.player.duration)
			this.updateProgressTime()
		})

		this.player.addEventListener('timeupdate', this.onTimeUpdate)
	},

	methods: {
		convertTimeMMSS(seconds) {
			return new Date(seconds * 1000).toISOString().substr(14, 5)
		},
		playback() {
			if (this.messageSelectionEnabled || !this.audioSource) return

			if (this.isPlaying) this.player.pause()
			else setTimeout(() => this.player.play())

			this.isPlaying = !this.isPlaying
		},
		resetProgress() {
			if (this.isPlaying) this.player.pause()

			this.duration = this.convertTimeMMSS(0)
			this.playedTime = this.convertTimeMMSS(0)
			this.progress = 0
			this.isPlaying = false
			this.updateProgressTime()
		},
		onTimeUpdate() {
			this.playedTime = this.convertTimeMMSS(this.player.currentTime)
			this.progress = (this.player.currentTime / this.player.duration) * 100
			this.updateProgressTime()
		},
		onUpdateProgress(pos) {
			if (pos) this.player.currentTime = pos * this.player.duration
		},
		updateProgressTime() {
			this.$emit(
				'update-progress-time',
				this.progress > 1 ? this.playedTime : this.duration
			)
		}
	}
}
</script>
