<template>
  <div style="display: flex; width: 250px; background-color: v-bind(bg_color)" :class="{animate}">
    <div style="width: 40px; height: 50px; text-align: center">
      <div v-if="!is_playing" class="btn play-pause-btn" @click="play">
        <Icon class="icon" width="26" :icon="playArrowRounded" :inline="true" />
      </div>
      <div v-else class="btn play-pause-btn" @click="pause">
        <Icon class="icon" width="22" :icon="pauseIcon" :inline="true" />
      </div>
    </div>
    <!--        <div :style="style">-->
    <div style="width: 200px">
      <div id="vue_waveplayer_container" ref="vue_waveplayer_container" />
    </div>
    <div class="progress" style="display: none">
      <div style="justify-content: center; display: flex">
        {{ progress }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate {
  animation-name: expand;
  animation-duration: .75s;
  animation-fill-mode: forwards;
  transform-origin: 50% 50%;
}

.btn {
  background-color: v-bind(bg_color);
  margin: 5px;
  height: v-bind(height);
  border-top-left-radius: 20%;
  border-bottom-left-radius: 20%;
  color: red;
}

.progress {
  width: 50px;
  height: v-bind(height);
  display: flex;
  position: relative;
  align-items: center;
  margin-left: 10px;
  min-width: 50px;
  background-color: v-bind(bg_color);
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.play-pause-btn {
  animation-name: expand;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  transform-origin: 100% 0%;
}

.play-pause-btn .icon {
  animation-name: rotate;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  transform-origin: center;
}

@keyframes rotate {
  0% {
    transform: rotate(0);
    opacity: 0;
  }
  100% {
    transform: rotate(360deg);
    opacity: 1;
  }
}

@keyframes expand {
  0% {
    transform: scaleX(0%)
  }
  33% {
    transform: scaleX(110%)
  }
  66% {
    transform: scaleX(90%)
  }
  100% {
    transform: scaleX(100%)
  }
}
</style>

<!--<script lang="ts">-->
<!--import { defineComponent, computed, onMounted, PropType } from 'vue'-->

<!--export default defineComponent({-->
<!--  name: 'WavePlayer'-->
<!--})-->

<!--</script>-->

<script lang="ts" setup>
import { toRefs, defineProps, onMounted, computed, defineEmits } from 'vue'
import { Icon } from '@iconify/vue'
import playArrowRounded from '@iconify-icons/material-symbols/play-arrow-rounded'
import pauseIcon from '@iconify-icons/material-symbols/pause-rounded'
/* eslint-disable camelcase,vue/no-setup-props-destructure */
// noinspection TypeScriptCheckImport
import WaveSurfer from 'wavesurfer.js'

// import {$ref} from "vue/macros";

const props = defineProps({
  'url': { type: String, required: true },
  'duration': { type: Number, required: false, default: 0 },
  'backgroundColor': { type: String, default: '#3f87f7' },
  'waveColor': { type: String, default: '#a2c4ff' },
  'progressColor': { type: String, default: 'white' },
  'height': { type: Number, required: false, default: 25 },
  'animate': { type: Boolean, required: false, default: false },
  'autoLoad': { type: Boolean, default: true, required: false }
})

const bg_color = props.backgroundColor

let vue_waveplayer_container = $ref()
let is_playing = $ref(false)
let finished = $ref(false)
let show = $ref(false)

let duration: number = $ref(props.duration)
let pos: number = $ref(0)

let wavesurfer: WaveSurfer | null = null
let style = $ref(`width: ${document.documentElement.clientWidth - 100 - 20}px`)

const emits = defineEmits(['hover-audio-progress', 'update-progress-time'])

const progress = computed(() => {
  // const totalSeconds = Math.floor((total - pos) / 1000)
  const totalSeconds = Math.floor(pos)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds - minutes * 60
  const ret = `${minutes}:${seconds.toString().padStart(2, '0')}`

  // TODO by j4hangir: Probably best to optimize this
  emits('update-progress-time', ret)
  return ret
})

async function play() {
  if (!props.autoLoad) wavesurfer?.load(props.url)
  await until(() => wavesurfer != null && wavesurfer.isReady)

  if (!wavesurfer) return
  // console.log(wavesurfer)
  // console.log(wavesurfer.playhead)
  is_playing = true
  // if (finished) {
  wavesurfer.play()
  //     finished = false
  // } else
  //     wavesurfer.play(wavesurfer!.getCurrentTime());
}

async function pause() {
  if (!wavesurfer && is_playing) return
  is_playing = false
  wavesurfer!.pause()
}

function on_seek(progress: number) {
  if (!is_playing) {
    play()
  }
}

function on_finish() {
  is_playing = false
  finished = true
}

async function until(predicate: () => boolean, interval = 100) {
  const poll = (done: any) => (predicate() ? done() : setTimeout(() => poll(done), interval))
  return new Promise(poll)
}

onMounted(async () => {
  // console.log(vue_waveplayer_container)
  // await until(() => document.querySelector('#vue_waveplayer_container'))
  // console.log('here we go')
  wavesurfer = WaveSurfer.create({
    container: vue_waveplayer_container,
    barRadius: 10,
    barWidth: 4,
    mediaControls: false,
    normalize: false,
    barHeight: 7,
    responsive: true,
    cursorColor: 'transparent',
    fillParent: true,
    hideScrollbar: true,
    minPxPerSec: 10,
    height: props.height,
    waveColor: props.waveColor,
    progressColor: props.progressColor,
    backgroundColor: bg_color

  })
  // console.log(wavesurfer)

  wavesurfer.on('seek', on_seek)
  wavesurfer.on('finish', on_finish)
  wavesurfer.on('audioprocess', time => pos = time)
  if (props.autoLoad) wavesurfer.load(props.url)
  wavesurfer.on('ready', () => {
    duration = wavesurfer.getDuration()
  })
})

</script>
