<template>
	<transition name="vac-slide-up">
		<div
			v-if="filteredEmojis.length"
			class="vac-emojis-container vac-app-box-shadow"
			:style="{ bottom: `${$parent.$refs.roomFooter.clientHeight}px` }"
		>
			<div
				v-for="emoji in filteredEmojis"
				:key="emoji"
				class="vac-emoji-element"
				@click="$emit('select-emoji', emoji)"
			>
				{{ emoji }}
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'RoomEmojis',

	props: {
		filteredEmojis: { type: Array, required: true }
	}
}
</script>
