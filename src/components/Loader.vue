<template>
  <transition name="acc-fade-spinner" appear>
    <div
      v-if="show"
      class="acc-loader-wrapper"
      role="status"
      aria-label="Loading"
      :class="{
        'acc-container-center': !infinite,
        'acc-container-top': infinite,
      }"
    >
      <div id="acc-circle" />
    </div>
  </transition>
</template>

<script setup lang="ts">
export interface LoaderProps {
  /** Whether to show the loader */
  show: boolean
  /** Whether the loader is for infinite scrolling */
  infinite?: boolean
}

withDefaults(defineProps<LoaderProps>(), {
  show: false,
  infinite: false,
})
</script>

<style lang="scss" scoped>
.acc-loader-wrapper {
  &.acc-container-center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 9;
  }

  &.acc-container-top {
    padding: 21px;

    #acc-circle {
      height: 20px;
      width: 20px;
    }
  }

  #acc-circle {
    margin: auto;
    height: 28px;
    width: 28px;
    border: 3px rgba(0, 0, 0, 0.25) solid;
    border-top: 3px var(--chat-color-spinner) solid;
    border-right: 3px var(--chat-color-spinner) solid;
    border-bottom: 3px var(--chat-color-spinner) solid;
    border-radius: 50%;
    -webkit-animation: acc-spin 1s infinite linear;
    animation: acc-spin 1s infinite linear;
  }

  @media only screen and (max-width: 768px) {
    #acc-circle {
      height: 24px;
      width: 24px;
    }

    &.acc-container-top {
      padding: 18px;

      #acc-circle {
        height: 16px;
        width: 16px;
      }
    }
  }
}

@-webkit-keyframes acc-spin {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
    transform: rotate(359deg);
  }
}
@keyframes acc-spin {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
    transform: rotate(359deg);
    -webkit-transform: rotate(359deg);
    transform: rotate(359deg);
  }
}
</style>
