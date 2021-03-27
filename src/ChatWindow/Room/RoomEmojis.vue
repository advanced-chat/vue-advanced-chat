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

<style lang="scss">
.vac-emojis-container {
	position: absolute;
	width: calc(100% - 16px);
	padding: 10px 8px;
	background: var(--chat-footer-bg-color);
	display: flex;
	align-items: center;
	overflow: auto;

	.vac-emoji-element {
		padding: 0 8px;
		font-size: 30px;
		border-radius: 4px;
		cursor: pointer;

		&:hover {
			background: var(--chat-footer-bg-color-tag-active);
			transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
		}

		&:not(:hover) {
			transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
		}
	}
}

@media only screen and (max-width: 768px) {
	.vac-emojis-container {
		width: calc(100% - 10px);
		padding: 7px 5px;

		.vac-emoji-element {
			padding: 0 7px;
			font-size: 26px;
		}
	}
}
</style>
