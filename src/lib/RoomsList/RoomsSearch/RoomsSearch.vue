<template>
	<div
		:class="{
			'vac-box-search': showSearchBar,
			'vac-box-empty': !showSearchBar
		}"
	>
		<template v-if="showSearch">
			<div v-if="!loadingRooms && rooms.length" class="vac-icon-search">
				<slot name="search-icon">
					<svg-icon name="search" />
				</slot>
			</div>
			<input
				v-if="!loadingRooms && rooms.length"
				type="search"
				:placeholder="textMessages.SEARCH"
				autocomplete="off"
				class="vac-input"
				@input="$emit('search-room', $event)"
			/>
		</template>
		<div
			v-if="showAddRoom"
			class="vac-svg-button vac-add-icon"
			@click="$emit('add-room')"
		>
			<slot name="add-icon">
				<svg-icon name="add" />
			</slot>
		</div>
	</div>
</template>

<script>
import SvgIcon from '../../../components/SvgIcon/SvgIcon'

export default {
	name: 'RoomsSearch',
	components: { SvgIcon },

	props: {
		textMessages: { type: Object, required: true },
		showSearch: { type: Boolean, required: true },
		showAddRoom: { type: Boolean, required: true },
		rooms: { type: Array, required: true },
		loadingRooms: { type: Boolean, required: true }
	},

	emits: ['search-room', 'add-room'],

	computed: {
		showSearchBar() {
			return this.showSearch || this.showAddRoom
		}
	}
}
</script>
