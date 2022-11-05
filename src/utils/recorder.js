// Credits to https://github.com/grishkovelli/vue-audio-recorder

import { VoiceRecorder } from 'capacitor-voice-recorder'

export default class {
  constructor(options = {}) {
    this.beforeRecording = options.beforeRecording
    this.pauseRecording = options.pauseRecording
    this.afterRecording = options.afterRecording
    this.micFailed = options.micFailed

    this.encoderOptions = {
      bitRate: options.bitRate,
      sampleRate: options.sampleRate
    }

    this.bufferSize = 4096
    this.records = []

    this.isPause = false
    this.isRecording = false

    this.duration = 0
    this.volume = 0

    this._duration = 0
    this.timerInterval = -1
  }

  startTimer() {
    this.timerInterval = setInterval(() => this.duration++, 1000)
  }

  stopTimer() {
    clearInterval(this.timerInterval)
  }

  async start() {
    let res = await VoiceRecorder.canDeviceVoiceRecord()
    if (!res.value) {
      return this._micError('No recording device available!')
    }

    const audioRequest = await VoiceRecorder.requestAudioRecordingPermission()
    if (!audioRequest.value) {
      return this._micError('Recording permission not granted!')
    }
    res = await VoiceRecorder.startRecording()
    this.startTimer()

    this.beforeRecording && this.beforeRecording('start recording')

    this.isPause = false
    this.isRecording = true
  }

  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data)
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize)

      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }

    const blob = new Blob(byteArrays, { type: contentType })
    return blob
  }

  async stop() {
    this.stopTimer()

    const res = await VoiceRecorder.stopRecording()
    const base64Sound = res.value.recordDataBase64
    const mimeType = res.value.mimeType

    const record = {
      blob: this.b64toBlob(base64Sound, mimeType),
      duration: res.value.msDuration

    }
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
