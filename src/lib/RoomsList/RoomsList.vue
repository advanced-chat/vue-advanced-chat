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

    <div v-if="!loadingRooms && !rooms.length" class="vac-rooms-empty">
      <slot name="rooms-empty">
        {{ textMessages.ROOMS_EMPTY }}
      </slot>
    </div>

    <div v-if="!loadingRooms && roomsToDisplay.length" id="rooms-list" class="vac-room-list">
      <transition-group name="rooms">
        <slot v-if="hasArchivedRooms" name="rooms-list-archived">
          <div class="vac-rooms-archived" @click="$emit('click-archived-rooms')">
            <svg-icon name="archive" />
            <span>{{ textMessages.ARCHIVED_ROOMS }}</span>
          </div>
        </slot>

        <div
          v-for="fRoom in roomsToDisplay"
          :id="fRoom.roomId"
          :key="fRoom.roomId"
          class="vac-room-item"
          :class="{
            'vac-room-selected': selectedRoomId === fRoom.roomId && !shouldShowCallContent(fRoom),
            'vac-ongoing-call': shouldShowCallContent(fRoom)
          }"
          @click="openRoom(fRoom)"
        >
          <room-call-content
            v-if="shouldShowCallContent(fRoom)"
            :current-user-id="currentUserId"
            :room="fRoom"
            :call="call"
            :text-messages="textMessages"
            @accept-call="$emit('accept-call', $event)"
            @hang-up-call="$emit('hang-up-call', $event)"
            @return-to-call="$emit('return-to-call', $event)"
          />
          <room-content
            v-else
            :current-user-id="currentUserId"
            :room="fRoom"
            :text-formatting="textFormatting"
            :link-options="linkOptions"
            :text-messages="textMessages"
            :selected-room-id="selectedRoomId"
            :room-actions="roomActions"
            @room-action-handler="$emit('room-action-handler', $event)"
          >
            <template v-for="(idx, name) in $slots" #[name]="data">
              <slot :name="name" v-bind="data" />
            </template>
          </room-content>
        </div>
      </transition-group>
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
    <transition name="vac-fade-message">
      <!--
        I only want to show this label when there is a non
        empty query AND when it matches no room.
      -->
      <div v-if="roomsQuery.length && !filteredRooms.length" class="no-rooms-found-message">
        {{ roomsNotFoundMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
import Loader from '../../components/Loader/Loader'

import RoomsSearch from './RoomsSearch/RoomsSearch'
import RoomContent from './RoomContent/RoomContent'
import RoomCallContent from './RoomCallContent/RoomCallContent'
import SvgIcon from '../../components/SvgIcon/SvgIcon'

import filteredItems from '../../utils/filter-items'

export default {
  name: 'RoomsList',
  components: {
    Loader,
    RoomsSearch,
    RoomContent,
    RoomCallContent,
    SvgIcon
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
    roomsNotFoundMessage: { type: String, required: true },
    call: { type: Object, required: true },
    showArchivedRooms: { type: Boolean, required: true }
  },

  emits: [
    'add-room',
    'search-room',
    'room-action-handler',
    'loading-more-rooms',
    'fetch-room',
    'fetch-more-rooms',
    'accept-call',
    'hang-up-call',
    'return-to-call',
    'click-archived-rooms'
  ],

  data() {
    return {
      filteredRooms: [],
      observer: null,
      showLoader: true,
      loadingMoreRooms: false,
      selectedRoomId: '',
      roomsQuery: ''
    }
  },

  computed: {
    roomsToDisplay: function() {
      let roomsToReturn = this.roomsQuery.length ? this.filteredRooms : this.rooms

      if (this.showArchivedRooms) {
        return roomsToReturn.filter(room => room.isArchived)
      }

      return roomsToReturn.filter(room => !room.isArchived)
    },
    hasArchivedRooms: function() {
      return this.rooms.some(room => room.isArchived)
    }
  },

  watch: {
    rooms: {
      deep: true,
      handler(newVal, oldVal) {
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
				this.roomsQuery = ev.target.value
				this.filteredRooms = filteredItems(
					this.rooms,
					['roomName', 'email'],
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
    shouldShowCallContent: function(room) {
      const hasCallEnded = room.call && room.call.statusEnded
      const canAcceptCall = room.call && !room.call.attendence.statusCallEnded && !room.call.attendence.statusDeclined

      return !hasCallEnded && canAcceptCall
    }
  }
}
</script>
