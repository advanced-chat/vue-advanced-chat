<template>
	<div
		v-show="showRoomsList"
		class="vac-rooms-container vac-app-border-r"
		:class="{ 'vac-rooms-container-full': isMobile }"
	>
		<slot name="rooms-header" />

		<slot name="rooms-list-search">
			<rooms-search
				:rooms="rooms"
				:loading-rooms="loadingRooms"
				:text-messages="textMessages"
				:show-search="showSearch"
				:show-add-room="showAddRoom"
				@search-room="searchRoom"
				@add-room="$emit('add-room')"
			>
				<template v-for="(i, name) in $scopedSlots" #[name]="data">
					<slot :name="name" v-bind="data" />
				</template>
			</rooms-search>
		</slot>

		<loader :show="loadingRooms" />

		<div v-if="!loadingRooms && !rooms.length" class="vac-rooms-empty">
			<slot name="rooms-empty">
				{{ textMessages.ROOMS_EMPTY }}
			</slot>
		</div>

		<div v-if="!loadingRooms" class="vac-room-list">
			<div
				v-for="fRoom in filteredRooms"
				:id="fRoom.roomId"
				:key="fRoom.roomId"
				class="vac-room-item"
				:class="{ 'vac-room-selected': selectedRoomId === fRoom.roomId }"
				@click="openRoom(fRoom)"
			>
				<room-content
					:current-user-id="currentUserId"
					:room="fRoom"
					:text-formatting="textFormatting"
					:link-options="linkOptions"
					:text-messages="textMessages"
					:room-actions="roomActions"
					@room-action-handler="$emit('room-action-handler', $event)"
				>
					<template v-for="(i, name) in $scopedSlots" #[name]="data">
						<slot :name="name" v-bind="data" />
					</template>
				</room-content>
			</div>
			<transition name="vac-fade-message">
				<infinite-loading
					v-if="rooms.length && !loadingRooms"
					force-use-infinite-wrapper=".vac-room-list"
					web-component-name="vue-advanced-chat"
					spinner="spiral"
					@infinite="loadMoreRooms"
				>
					<div slot="spinner">
						<loader :show="true" :infinite="true" />
					</div>
					<div slot="no-results" />
					<div slot="no-more" />
				</infinite-loading>
			</transition>
		</div>
	</div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'

import Loader from '../../components/Loader/Loader'

import RoomsSearch from './RoomsSearch/RoomsSearch'
import RoomContent from './RoomContent/RoomContent'

import filteredUsers from '../../utils/filter-items'

export default {
	name: 'RoomsList',
	components: {
		InfiniteLoading,
		Loader,
		RoomsSearch,
		RoomContent
	},

	props: {
		currentUserId: { type: [String, Number], required: true },
		textMessages: { type: Object, required: true },
		showRoomsList: { type: Boolean, required: true },
		showSearch: { type: Boolean, required: true },
		showAddRoom: { type: Boolean, required: true },
		textFormatting: { type: Boolean, required: true },
		linkOptions: { type: Object, required: true },
		isMobile: { type: Boolean, required: true },
		rooms: { type: Array, required: true },
		loadingRooms: { type: Boolean, required: true },
		roomsLoaded: { type: Boolean, required: true },
		room: { type: Object, required: true },
		roomActions: { type: Array, required: true }
	},

	data() {
		return {
			filteredRooms: this.rooms || [],
			infiniteState: null,
			loadingMoreRooms: false,
			selectedRoomId: ''
		}
	},

	watch: {
		rooms(newVal, oldVal) {
			this.filteredRooms = newVal

			if (
				this.infiniteState &&
				(newVal.length !== oldVal.length || this.roomsLoaded)
			) {
				this.infiniteState.loaded()
				this.loadingMoreRooms = false
			}
		},
		loadingRooms(val) {
			if (val) this.infiniteState = null
		},
		loadingMoreRooms(val) {
			this.$emit('loading-more-rooms', val)
		},
		roomsLoaded(val) {
			if (val && this.infiniteState) {
				this.loadingMoreRooms = false
				this.infiniteState.complete()
			}
		},
		room: {
			immediate: true,
			handler(val) {
				if (val && !this.isMobile) this.selectedRoomId = val.roomId
			}
		}
	},

	methods: {
		searchRoom(ev) {
			this.filteredRooms = filteredUsers(
				this.rooms,
				'roomName',
				ev.target.value
			)
		},
		openRoom(room) {
			if (room.roomId === this.room.roomId && !this.isMobile) return
			if (!this.isMobile) this.selectedRoomId = room.roomId
			this.$emit('fetch-room', { room })
		},
		loadMoreRooms(infiniteState) {
			if (this.loadingMoreRooms) return

			if (this.roomsLoaded) {
				this.loadingMoreRooms = false
				return infiniteState.complete()
			}

			this.infiniteState = infiniteState
			this.$emit('fetch-more-rooms')
			this.loadingMoreRooms = true
		}
	}
}
</script>
