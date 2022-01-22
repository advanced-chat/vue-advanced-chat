<template>
	<transition name="vac-slide-up">
		<div
			v-if="filteredTemplatesText.length"
			class="vac-template-container vac-app-box-shadow"
			:style="{ bottom: `${footerHeight}px` }"
		>
			<div
				v-for="(template, index) in filteredTemplatesText"
				:key="index"
				class="vac-template-box"
				:class="{ 'vac-template-active': index === activeItem }"
				@mouseover="activeItem = index"
				@click="$emit('select-template-text', template)"
			>
				<div class="vac-template-info">
					<div class="vac-template-tag">
						/{{ template.tag }}
					</div>
					<div class="vac-template-text">
						{{ template.text }}
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'RoomTemplatesText',

	props: {
		filteredTemplatesText: { type: Array, required: true },
		selectItem: { type: Boolean, default: null },
		activeUpOrDown: { type: Number, default: null }
	},

	emits: ['select-template-text', 'activate-item'],

	data() {
		return {
			activeItem: null
		}
	},

	computed: {
		footerHeight() {
			return document.getElementById('room-footer').clientHeight
		}
	},

	watch: {
		filteredTemplatesText(val, oldVal) {
			if (!oldVal.length || val.length !== oldVal.length) {
				this.activeItem = 0
			}
		},
		selectItem(val) {
			if (val) {
				this.$emit(
					'select-template-text',
					this.filteredTemplatesText[this.activeItem]
				)
			}
		},
		activeUpOrDown() {
			if (
				this.activeUpOrDown > 0 &&
				this.activeItem < this.filteredTemplatesText.length - 1
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
