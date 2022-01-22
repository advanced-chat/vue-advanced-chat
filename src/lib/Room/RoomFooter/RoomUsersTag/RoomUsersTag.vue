<template>
	<transition name="vac-slide-up">
		<div
			v-if="filteredUsersTag.length"
			class="vac-tags-container"
			:style="{ bottom: `${footerHeight}px` }"
		>
			<div
				v-for="(user, index) in filteredUsersTag"
				:key="user._id"
				class="vac-tags-box"
				:class="{ 'vac-tags-box-active': index === activeItem }"
				@mouseover="activeItem = index"
				@click="$emit('select-user-tag', user)"
			>
				<div class="vac-tags-info">
					<div
						v-if="user.avatar"
						class="vac-avatar vac-tags-avatar"
						:style="{ 'background-image': `url('${user.avatar}')` }"
					/>
					<div class="vac-tags-username">
						{{ user.username }}
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'RoomUsersTag',

	props: {
		filteredUsersTag: { type: Array, required: true },
		selectItem: { type: Boolean, default: null },
		activeUpOrDown: { type: Number, default: null }
	},

	emits: ['select-user-tag', 'activate-item'],

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
		filteredUsersTag(val, oldVal) {
			if (!oldVal.length || val.length !== oldVal.length) {
				this.activeItem = 0
			}
		},
		selectItem(val) {
			if (val) {
				this.$emit('select-user-tag', this.filteredUsersTag[this.activeItem])
			}
		},
		activeUpOrDown() {
			if (
				this.activeUpOrDown > 0 &&
				this.activeItem < this.filteredUsersTag.length - 1
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
