<template>
  <transition-group v-if="!message.deleted" name="vac-slide-left" tag="span">
    <div class="vac-message-reactions-container" :class="{'message-me' : message.senderId === currentUserId}">
      <div
        class="vac-reactions-container"
        @click="messageReactionClick()"
      >
      <span
        v-for="(reaction, key) in message.reactions"
        v-show="reaction.length"
        :key="key + 0"
        class="vac-reactions"
      >
      {{ key }}
    </span>
        <span v-if="getTotalReactionCount() > 1" class="reaction-counter">{{ getTotalReactionCount() }}</span>
      </div>
    </div>
</transition-group>
</template>

<script>
export default {
  name: 'MessageReactions',

  props: {
    currentUserId: { type: [String, Number], required: true },
    message: { type: Object, required: true }
  },

  emits: ['message-reaction-click'],

  methods: {
    messageReactionClick() {
      this.$emit('message-reaction-click')
    },
    getTotalReactionCount() {
      if (!this.$props.message.reactions || typeof this.$props.message.reactions !== 'object') {
        return 0
      }

      const reactionArrays = Object.values(this.$props.message.reactions)
      return reactionArrays.reduce((count, reactionArray) => count + reactionArray.length, 0)
    }
  }
}
</script>
