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
				@change-linehead="onUpdateProgress"
				@hover-audio-progress="$emit('hover-audio-progress', $event)"
			/>

			<audio :id="playerUniqId" :src="audioSource" />
		</div>
		<div class="vac-player-time">
			{{ time }}
		</div>
	</div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon'
import AudioControl from './AudioControl'

export default {
	name: 'AudioPlayer',
	components: {
		SvgIcon,
		AudioControl
	},

	props: {
		src: { type: String, default: null }
	},

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
			return `audio-player${this._uid}`
		},
		audioSource() {
			if (this.src) return this.src
			this.resetProgress()
			return null
		},
		time() {
			return this.progress > 1 ? this.playedTime : this.duration
		}
	},

	mounted() {
		this.player = document.getElementById(this.playerUniqId)

		this.player.addEventListener('ended', () => {
			this.isPlaying = false
		})

		this.player.addEventListener('loadeddata', ev => {
			this.resetProgress()
			this.duration = this.convertTimeMMSS(this.player.duration)
		})

		this.player.addEventListener('timeupdate', this.onTimeUpdate)
	},

	methods: {
		convertTimeMMSS(seconds) {
			return new Date(seconds * 1000).toISOString().substr(14, 5)
		},
		playback() {
			if (!this.audioSource) return

			if (this.isPlaying) this.player.pause()
			else setTimeout(() => this.player.play(), 0)

			this.isPlaying = !this.isPlaying
		},
		resetProgress() {
			if (this.isPlaying) this.player.pause()

			this.duration = this.convertTimeMMSS(0)
			this.playedTime = this.convertTimeMMSS(0)
			this.progress = 0
			this.isPlaying = false
		},
		onTimeUpdate() {
			this.playedTime = this.convertTimeMMSS(this.player.currentTime)
			this.progress = (this.player.currentTime / this.player.duration) * 100
		},
		onUpdateProgress(pos) {
			if (pos) this.player.currentTime = pos * this.player.duration
		}
	}
}
</script>

<style lang="scss">
.vac-audio-player {
	display: flex;
	margin-top: 15px;

	.vac-svg-button {
		max-width: 20px;
		margin-left: 7px;
	}
}

.vac-player-time {
	margin-left: 41px;
	color: var(--chat-color);
	font-size: 12px;
}
</style>
