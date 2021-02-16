<template>
	<div>
		<div class="vac-audio-player">
			<div class="vac-svg-button" @click="playback">
				<svg-icon :name="isPlaying ? 'audio-pause' : 'audio-play'" />
			</div>

			<div class="vac-player-bar">
				<line-control
					class="vac-player-progress"
					ref-id="progress"
					:percentage="progress"
					@change-linehead="onUpdateProgress"
				/>
			</div>

			<audio :id="playerUniqId" :src="audioSource" />
		</div>
		<div class="vac-player-time">
			{{ time }}
		</div>
	</div>
</template>

<script>
import SvgIcon from '../SvgIcon'
import LineControl from './LineControl'

export default {
	name: 'AudioPlayer',
	components: {
		SvgIcon,
		LineControl
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
			return this.isPlaying ? this.playedTime : this.duration
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
	}

	.vac-player-bar {
		display: flex;
		align-items: center;
		max-width: calc(100% - 18px);

		.vac-player-progress {
			width: 200px;
			margin: 0 4px 0 14px;
		}
	}
}

.vac-player-time {
	margin-left: 35px;
	color: var(--chat-color);
	font-size: 13px;
}
</style>
