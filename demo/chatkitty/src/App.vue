<script setup>
import {ChatUi} from '@chatkitty/vue'
import { ref } from 'vue'

const username = ref('demo_user') // Set to the current user's username
</script>

<template>
  <div style="width: 100vw; height: 95svh">
    <!-- Replace widgetId with your widget ID from console.chatkitty.com -->
    <!-- Remove mode="sandbox" in production environment -->
    <ChatUi
      widgetId="5IKgX7UHsLr1cWJ5"
      mode="sandbox"
      :username="username"
    />
  </div>
</template>
