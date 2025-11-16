<template>
  <transition name="vac-fade-spinner" appear>
    <div ref="progress" class="vac-progress-wrapper">
      <svg :height="radius * 2" :width="radius * 2">
        <circle
          stroke="rgba(255, 255, 255, 0.7)"
          :stroke-dasharray="circumference + ' ' + circumference"
          :style="{
            strokeDashoffset: strokeDashoffset,
            strokeLinecap: 'round',
          }"
          :stroke-width="stroke"
          fill="transparent"
          :r="normalizedRadius"
          :cx="radius"
          :cy="radius"
        />
      </svg>
      <div
        class="vac-progress-content"
        :style="{
          height: radius * 2 - 19 + 'px',
          width: radius * 2 - 19 + 'px',
        }"
      >
        <div class="vac-progress-text">
          {{ progress }}<span class="vac-progress-percent">%</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

export interface ProgressBarProps {
  /** The progress percentage */
  progress: number
}

const props = defineProps<ProgressBarProps>()

const radius = 35
const stroke = 4
const normalizedRadius = radius - stroke * 2
const circumference = normalizedRadius * 2 * Math.PI

const strokeDashoffset = computed(() => {
  return circumference - (props.progress / 100) * circumference
})

const progress = computed(() => props.progress)
</script>

<style lang="scss" scoped>
.vac-progress-wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 9;

  circle {
    transition: stroke-dashoffset 0.35s;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
  }

  .vac-progress-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    margin-top: -2px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 50%;

    .vac-progress-text {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-weight: bold;
      color: white;

      .vac-progress-percent {
        font-size: 9px;
        font-weight: normal;
      }
    }
  }
}
</style>
