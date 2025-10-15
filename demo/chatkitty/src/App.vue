<script setup>
import {ChatUi} from '@chatkitty/vue'
</script>

<template>
  <div style="width: 100vw; height: 100svh">
    <!-- Replace widgetId with your widget ID from console.chatkitty.com -->
    <!-- Remove mode="sandbox" in production environment -->
    <ChatUi
      widgetId="5IKgX7UHsLr1cWJ5"
      username=username
      mode="sandbox"/>
  </div>
</template>
