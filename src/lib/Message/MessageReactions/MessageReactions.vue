<template>
	<transition-group v-if="!message.deleted" name="vac-slide-left">
		<button
			v-for="(reaction, key) in message.reactions"
			v-show="reaction.length"
			:key="key + 0"
			class="vac-button-reaction"
			:class="{
				'vac-reaction-me': reaction.indexOf(currentUserId) !== -1
			}"
			:style="{
				float: message.senderId === currentUserId ? 'right' : 'left'
			}"
			@click="sendMessageReaction({ name: key }, reaction)"
		>
			{{ getEmojiByName(key) }}<span>{{ reaction.length }}</span>
		</button>
	</transition-group>
</template>

<script>
export default {
	name: 'MessageReactions',

	props: {
		currentUserId: { type: [String, Number], required: true },
		message: { type: Object, required: true },
		emojisList: { type: Object, required: true }
	},

	methods: {
		getEmojiByName(emojiName) {
			return this.emojisList[emojiName]
		},
		sendMessageReaction(emoji, reaction) {
			this.$emit('send-message-reaction', { emoji, reaction })
		}
	}
}
</script>
