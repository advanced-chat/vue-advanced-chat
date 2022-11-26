<template>
	<transition name="vac-slide-up">
		<div v-if="filteredEmojis.length" class="vac-emojis-container">
			<div
				v-for="(emoji, index) in filteredEmojis"
				:key="emoji"
				class="vac-emoji-element"
				:class="{ 'vac-emoji-element-active': index === activeItem }"
				@mouseover="activeItem = index"
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
		filteredEmojis: { type: Array, required: true },
		selectItem: { type: Boolean, default: null },
		activeUpOrDown: { type: Number, default: null }
	},

	emits: ['select-emoji', 'activate-item'],

	data() {
		return {
			activeItem: null
		}
	},

	watch: {
		filteredEmojis(val, oldVal) {
			if (!oldVal.length || val.length !== oldVal.length) {
				this.activeItem = 0
			}
		},
		selectItem(val) {
			if (val) {
				this.$emit('select-emoji', this.filteredEmojis[this.activeItem])
			}
		},
		activeUpOrDown() {
			if (
				this.activeUpOrDown > 0 &&
				this.activeItem < this.filteredEmojis.length - 1
			) {
				this.activeItem++
			} else if (this.activeUpOrDown < 0 && this.activeItem > 0) {
				this.activeItem--
			}
			this.$emit('activate-item')
		}
	}
}
</script>
