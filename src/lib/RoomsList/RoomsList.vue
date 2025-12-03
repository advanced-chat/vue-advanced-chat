<template>
	<div
		v-show="showRoomsList"
		class="vac-rooms-container"
		:class="{
			'vac-rooms-container-full': isMobile,
			'vac-app-border-r': !isMobile
		}"
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
				<template v-for="(idx, name) in $slots" #[name]="data">
					<slot :name="name" v-bind="data" />
				</template>
			</rooms-search>
		</slot>

		<loader :show="loadingRooms" type="rooms">
			<template v-for="(idx, name) in $slots" #[name]="data">
				<slot :name="name" v-bind="data" />
			</template>
		</loader>

		<div v-if="!loadingRooms" id="rooms-list" class="vac-room-list">
			<template v-if="hasGroups">
				<div
					v-for="group in filteredGroupedRooms"
					:key="group.groupId"
					class="vac-room-group"
				>
          <div
            class="vac-room-group-header"
            @click="toggleGroup(group.groupId)"
          >
            <slot :name="'group-list-item_' + group.groupId">
              <div class="vac-room-group-name">
                <slot :name="'group-list-caption_' + group.groupId">
                  {{ group.groupName }}
                </slot>

                <slot :name="'group-list-room-counter_' + group.groupId">
                  <span class="vac-group-room-counter">({{ group.rooms.length }})</span>
                </slot>
              </div>

              <div
                class="vac-icon-arrow-wrapper"
                :class="{ 'vac-icon-arrow-wrapper-open': !collapsedGroups[group.groupId] }"
              >
                <slot :name="'group-toggle-icon_' + group.groupId">
                  <svg-icon name="dropdown" param="left" />
                </slot>
              </div>
            </slot>
          </div>

					<div
						v-if="!collapsedGroups[group.groupId]"
						class="vac-room-group-items"
					>
						<div
							v-for="fRoom in group.rooms"
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
								<template v-for="(idx, name) in $slots" #[name]="data">
									<slot :name="name" v-bind="data" />
								</template>
							</room-content>
						</div>
					</div>
				</div>
			</template>
			<template v-else>
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
						<template v-for="(idx, name) in $slots" #[name]="data">
							<slot :name="name" v-bind="data" />
						</template>
					</room-content>
				</div>
			</template>
			<transition name="vac-fade-message">
				<div v-if="rooms.length && !loadingRooms" id="infinite-loader-rooms">
					<loader :show="showLoader" :infinite="true" type="infinite-rooms">
						<template v-for="(idx, name) in $slots" #[name]="data">
							<slot :name="name" v-bind="data" />
						</template>
					</loader>
				</div>
			</transition>
		</div>

    <div v-if="!loadingRooms && !rooms.length" class="vac-rooms-empty">
      <slot name="rooms-empty">
        {{ textMessages.ROOMS_EMPTY }}
      </slot>
    </div>
	</div>
</template>

<script>
import Loader from '../../components/Loader/Loader'
import SvgIcon from '../../components/SvgIcon/SvgIcon'

import RoomsSearch from './RoomsSearch/RoomsSearch'
import RoomContent from './RoomContent/RoomContent'

import filteredItems from '../../utils/filter-items'

export default {
	name: 'RoomsList',
	components: {
		Loader,
		SvgIcon,
		RoomsSearch,
		RoomContent
	},

	props: {
		currentUserId: { type: [String, Number], required: true },
		textMessages: { type: Object, required: true },
		showRoomsList: { type: Boolean, required: true },
		showSearch: { type: Boolean, required: true },
		showAddRoom: { type: Boolean, required: true },
		textFormatting: { type: Object, required: true },
		linkOptions: { type: Object, required: true },
		isMobile: { type: Boolean, required: true },
		rooms: { type: Array, required: true },
		loadingRooms: { type: Boolean, required: true },
		roomsLoaded: { type: Boolean, required: true },
		room: { type: Object, required: true },
		customSearchRoomEnabled: { type: [Boolean, String], default: false },
		roomActions: { type: Array, required: true },
		scrollDistance: { type: Number, required: true },
    defaultGroupName: {type: String, default: 'Default group'},
		groups: { type: Array, default: () => [] }
	},

	emits: [
		'add-room',
		'search-room',
		'room-action-handler',
		'loading-more-rooms',
		'fetch-room',
		'fetch-more-rooms'
	],

	data() {
		return {
			observer: null,
			showLoader: true,
			loadingMoreRooms: false,
			selectedRoomId: '',
			collapsedGroups: {},
			searchText: ''
		}
	},

	computed: {
		hasGroups() {
			return this.showRoomsList && this.groups && this.groups.length > 0
		},
    getDefaultGroup() {
      return { groupId: 'default', groupName: this.defaultGroupName }
    },
		groupedRooms() {
			if (!this.hasGroups) {
				return [{ ...this.getDefaultGroup, rooms: this.rooms }]
			}

			const grouped = {}
			this.groups.forEach(group => {
				grouped[group.groupId] = { ...group, rooms: [] }
			})

			this.rooms.forEach(room => {
				const groupId = room.groupId || 'default'
				if (!grouped[groupId]) {
					grouped[groupId] = { ...this.getDefaultGroup, rooms: [] }
				}
				grouped[groupId].rooms.push(room)
			})

			return Object.values(grouped)
		},
		filteredGroupedRooms() {
			if (this.customSearchRoomEnabled || !this.searchText) {
				return this.groupedRooms
			}

			return this.groupedRooms.map(group => {
				const rooms = filteredItems(
					group.rooms,
					'roomName',
					this.searchText
				)
				return { ...group, rooms }
			}).filter(group => group.rooms.length)
		},
		filteredRooms() {
			if (this.customSearchRoomEnabled || !this.searchText) {
				return this.rooms
			}
			return filteredItems(this.rooms, 'roomName', this.searchText)
		}
	},

	watch: {
		rooms: {
			deep: true,
			handler(newVal, oldVal) {
				if (!this.hasGroups) {
					// Only update filteredRooms directly if not using groups
					this.filteredRooms = newVal
				}
				if (newVal.length !== oldVal.length || this.roomsLoaded) {
					this.loadingMoreRooms = false
				}
			}
		},
		loadingRooms(val) {
			if (!val) {
				setTimeout(() => this.initIntersectionObserver())
			}
		},
		loadingMoreRooms(val) {
			this.$emit('loading-more-rooms', val)
		},
		roomsLoaded: {
			immediate: true,
			handler(val) {
				if (val) {
					this.loadingMoreRooms = false
					if (!this.loadingRooms) {
						this.showLoader = false
					}
				}
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
		initIntersectionObserver() {
			if (this.observer) {
				this.showLoader = true
				this.observer.disconnect()
			}

			const loader = this.$el.querySelector('#infinite-loader-rooms')

			if (loader) {
				const options = {
					root: this.$el.querySelector('#rooms-list'),
					rootMargin: `${this.scrollDistance}px`,
					threshold: 0
				}

				this.observer = new IntersectionObserver(entries => {
					if (entries[0].isIntersecting) {
						this.loadMoreRooms()
					}
				}, options)

				this.observer.observe(loader)
			}
		},
		searchRoom(ev) {
			if (this.customSearchRoomEnabled) {
				this.$emit('search-room', ev.target.value)
			} else {
				this.filteredRooms = filteredItems(
					this.rooms,
					'roomName',
					ev.target.value
				)
			}
		},
		openRoom(room) {
			if (room.roomId === this.room.roomId && !this.isMobile) return
			if (!this.isMobile) this.selectedRoomId = room.roomId
			this.$emit('fetch-room', { room })
		},
		loadMoreRooms() {
			if (this.loadingMoreRooms) return

			if (this.roomsLoaded) {
				this.loadingMoreRooms = false
				this.showLoader = false
				return
			}

			this.$emit('fetch-more-rooms')
			this.loadingMoreRooms = true
		},
		toggleGroup(groupId) {
			this.collapsedGroups[groupId] = !this.collapsedGroups[groupId];
		}
	}
}
</script>
