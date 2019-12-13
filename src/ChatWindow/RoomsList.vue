<template>
	<div class="rooms-container app-border-r">
		<div class="box-search app-border-b">
			<div class="icon-search">
				<svg-icon fill="#9ca6af" name="search" />
			</div>
			<input
				type="text"
				:placeholder="textMessages.SEARCH"
				autocomplete="off"
				class="rooms-search"
				@input="searchRoom"
			/>
			<div class="svg-button" @click="addRoom">
				<svg-icon fill="#1976d2" name="add-circle" />
			</div>
		</div>

		<chat-loader :show="loadingRooms"></chat-loader>

		<div class="rooms-empty" v-if="!loadingRooms && !rooms.length">
			No rooms
		</div>

		<!-- :class="{ 'room-disabled': loadingMessages }" -->
		<div v-if="!loadingRooms" class="room-list">
			<div class="room-group">
				<div
					class="room-item"
					v-for="room in filteredRooms"
					:key="room.roomId"
					:class="{ 'room-selected': selectedRoomId === room.roomId }"
					@click="openRoom(room)"
				>
					<div
						v-if="room.avatar"
						class="room-avatar"
						:style="{ background: `url(${room.avatar})` }"
					></div>
					<div class="name-container">
						<div class="room-name">{{ room.roomName }}</div>
						<div class="room-name text-last" v-if="room.lastMessage">
							<span v-if="room.lastMessage.seen">
								<svg-icon fill="#0696c7" name="check" class="icon-check" />
							</span>
							<span>{{ room.lastMessage.content }}</span>
						</div>
						<div class="room-name text-date" v-if="room.lastMessage">
							{{ room.lastMessage.timestamp }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ChatLoader from './ChatLoader'
import filteredUsers from '../utils/filterItems'
import SvgIcon from './SvgIcon'

export default {
	name: 'rooms-list',
	components: { ChatLoader, SvgIcon },

	props: {
		rooms: { type: Array, required: true },
		loadingRooms: { type: Boolean, required: true },
		room: { type: Object, required: true },
		textMessages: { type: Object, required: true }
	},

	data() {
		return {
			filteredRooms: this.rooms || [],
			selectedRoomId: ''
		}
	},

	watch: {
		rooms(val) {
			if (val[0]) this.selectedRoomId = val[0].roomId
			this.filteredRooms = val
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
			if (room.roomId === this.room.roomId) return
			this.selectedRoomId = room.roomId
			this.$emit('fetchRoom', { room })
		},
		addRoom() {
			this.$emit('addRoom')
		}
	}
}
</script>

<style lang="scss" scoped>
.rooms-container {
	flex: 0 0 25%;
	max-width: 25%;
	position: relative;
}

.rooms-search {
	width: 100%;
	font-size: 16px;
	outline: 0;
	caret-color: #1976d2;
	border: none;
	padding: 10px;

	&::placeholder {
		color: #9ca6af;
	}
}

.box-search {
	display: flex;
	align-items: center;
	height: 64px;
	padding: 0 20px;
}

.icon-search {
	display: flex;
}

input {
	background: var(--chat-color-input);
	border-radius: 4px;
	margin: 0 10px;
}

.rooms-empty {
	font-size: 14px;
	color: #9ca6af;
	font-style: italic;
	text-align: center;
	margin: 40px 0;
}

.rooms-list {
	display: block;
	position: static;
}

.room-group {
	-webkit-box-flex: 0;
	flex: 0 1 auto;
	position: relative;
	max-width: 100%;
	background: var(--chat-text-color);
	cursor: pointer;

	:not(:hover) {
		-webkit-transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
		transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
	}

	:hover {
		background: var(--chat-bg-color-hover);
		-webkit-transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
		transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
	}
}

.room-selected {
	color: var(--chat-color-active) !important;
	background: var(--chat-bg-color-active) !important;

	:hover {
		background: var(--chat-bg-color-active);
	}
}

.room-item {
	border-bottom: 1px solid rgba(0, 0, 0, 0.12);
	-webkit-box-align: center;
	align-items: center;
	display: -webkit-box;
	-webkit-box-flex: 1;
	flex: 1 1 100%;
	padding: 0 16px;
	position: relative;
	min-height: 71px;
}

.room-avatar {
	background-size: cover !important;
	background-position: center center !important;
	background-repeat: no-repeat !important;
	height: 42px;
	width: 42px;
	margin-right: 15px;
	border-radius: 50%;
}

.name-container {
	-webkit-box-align: center;
	align-items: center;
	align-self: center;
	display: -webkit-box;
	display: flex;
	flex-wrap: wrap;
	-webkit-box-flex: 1;
	flex: 1 1;
	overflow: hidden;
	padding: 8px 0;
}

.room-name {
	-webkit-box-flex: 1;
	flex: 1 1 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	line-height: 22px;
}

.text-last {
	color: #67717a !important;
	font-size: 12px;
	line-height: 16px;
}

.text-date {
	color: #a2aeb8 !important;
	font-size: 11px;
	line-height: 16px;
}

.room-disabled {
	pointer-events: none;
}

.icon-check {
	height: 14px;
	width: 14px;
	vertical-align: middle;
	margin-top: -1px;
	margin-right: 1px;
}
</style>
