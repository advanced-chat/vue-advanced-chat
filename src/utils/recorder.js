// Credits to https://github.com/grishkovelli/vue-audio-recorder

import Mp3Encoder from './mp3-encoder'

export default class {
	constructor(options = {}) {
		this.beforeRecording = options.beforeRecording
		this.pauseRecording = options.pauseRecording
		this.afterRecording = options.afterRecording
		this.micFailed = options.micFailed

		this.encoderOptions = {
			bitRate: 128,
			sampleRate: 44100
		}

		this.bufferSize = 4096
		this.records = []

		this.isPause = false
		this.isRecording = false

		this.duration = 0
		this.volume = 0

		this._duration = 0
	}

	start() {
		const constraints = {
			video: false,
			audio: {
				channelCount: 1,
				echoCancellation: false
			}
		}

		this.beforeRecording && this.beforeRecording('start recording')

		navigator.mediaDevices
			.getUserMedia(constraints)
			.then(this._micCaptured.bind(this))
			.catch(this._micError.bind(this))

		this.isPause = false
		this.isRecording = true

		if (!this.lameEncoder) {
			this.lameEncoder = new Mp3Encoder(this.encoderOptions)
		}
	}

	stop() {
		this.stream.getTracks().forEach(track => track.stop())
		this.input.disconnect()
		this.processor.disconnect()
		this.context.close()

		let record = null

		record = this.lameEncoder.finish()

		record.duration = this.duration
		this.records.push(record)

		this._duration = 0
		this.duration = 0

		this.isPause = false
		this.isRecording = false

		this.afterRecording && this.afterRecording(record)
	}

	pause() {
		this.stream.getTracks().forEach(track => track.stop())
		this.input.disconnect()
		this.processor.disconnect()

		this._duration = this.duration
		this.isPause = true

		this.pauseRecording && this.pauseRecording('pause recording')
	}

	_micCaptured(stream) {
		this.context = new (window.AudioContext || window.webkitAudioContext)()
		this.duration = this._duration
		this.input = this.context.createMediaStreamSource(stream)
		this.processor = this.context.createScriptProcessor(this.bufferSize, 1, 1)
		this.stream = stream

		this.processor.onaudioprocess = ev => {
			const sample = ev.inputBuffer.getChannelData(0)
			let sum = 0.0

			if (this.lameEncoder) {
				this.lameEncoder.encode(sample)
			}

			for (let i = 0; i < sample.length; ++i) {
				sum += sample[i] * sample[i]
			}

			this.duration =
				parseFloat(this._duration) +
				parseFloat(this.context.currentTime.toFixed(2))
			this.volume = Math.sqrt(sum / sample.length).toFixed(2)
		}

		this.input.connect(this.processor)
		this.processor.connect(this.context.destination)
	}

	_micError(error) {
		this.micFailed && this.micFailed(error)
	}
}
