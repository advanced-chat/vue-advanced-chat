<template>
	<div
		class="rooms-container app-border-r"
		:class="{ 'rooms-container-full': isMobile }"
		v-if="showRoomsList"
	>
		<slot name="rooms-header"></slot>

		<div class="box-search">
			<div class="icon-search">
				<svg-icon name="search" />
			</div>
			<input
				type="text"
				:placeholder="textMessages.SEARCH"
				autocomplete="off"
				@input="searchRoom"
			/>
			<div v-if="showAddRoom" class="svg-button add-icon" @click="addRoom">
				<svg-icon name="add" />
			</div>
		</div>

		<loader :show="loadingRooms"></loader>

		<div class="rooms-empty" v-if="!loadingRooms && !rooms.length">
			No rooms
		</div>

		<div v-if="!loadingRooms" class="room-list">
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
					:style="{ 'background-image': `url(${room.avatar})` }"
				></div>
				<div class="name-container">
					<div class="title-container">
						<div
							v-if="userStatus(room)"
							class="state-circle"
							:class="{ 'state-online': userStatus(room) === 'online' }"
						></div>
						<div class="room-name text-ellipsis">
							{{ room.roomName }}
						</div>
						<div class="text-date" v-if="room.lastMessage">
							{{ room.lastMessage.timestamp }}
						</div>
					</div>
					<div
						class="text-last text-ellipsis"
						:class="{ 'message-new': room.lastMessage.new }"
						v-if="room.lastMessage"
					>
						<span v-if="room.lastMessage.seen">
							<svg-icon name="checkmark" class="icon-check" />
						</span>
						<span>{{ room.lastMessage.content }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Loader from './Loader'
import filteredUsers from '../utils/filterItems'
import SvgIcon from './SvgIcon'

export default {
	name: 'rooms-list',
	components: { Loader, SvgIcon },

	props: {
		currentUserId: { type: [String, Number], required: true },
		textMessages: { type: Object, required: true },
		showRoomsList: { type: Boolean, required: true },
		showAddRoom: { type: Boolean, required: true },
		isMobile: { type: Boolean, required: true },
		rooms: { type: Array, required: true },
		loadingRooms: { type: Boolean, required: true },
		room: { type: Object, required: true }
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
			if (room.roomId === this.room.roomId && !this.isMobile) return
			this.selectedRoomId = room.roomId
			this.$emit('fetchRoom', { room })
		},
		addRoom() {
			this.$emit('addRoom')
		},
		userStatus(room) {
			if (!room.users || room.users.length !== 2) return

			const user = room.users.find(u => u._id !== this.currentUserId)

			if (user.status) return user.status.state
		}
	}
}
</script>

<style lang="scss" scoped>
.rooms-container {
	flex: 0 0 25%;
	position: relative;
	background: var(--chat-sidemenu-bg-color);
	height: 100%;
	overflow-y: auto;
	border-top-left-radius: var(--chat-container-border-radius);
	border-bottom-left-radius: var(--chat-container-border-radius);
}

.rooms-container-full {
	flex: 0 0 100%;
}

.box-search {
	display: flex;
	align-items: center;
	height: 64px;
	padding: 0 20px;
	margin-top: 5px;
}

.icon-search {
	display: flex;
	position: absolute;
	left: 30px;
	margin-top: 1px;

	svg {
		width: 22px;
		height: 22px;
	}
}

.add-icon {
	margin-left: 20px;
}

input {
	background: var(--chat-bg-color-input);
	color: var(--chat-color);
	border-radius: 4px;
	width: 100%;
	font-size: 15px;
	outline: 0;
	caret-color: var(--chat-color-caret);
	padding: 10px 10px 10px 38px;
	border: 1px solid var(--chat-sidemenu-border-color-search);
	border-radius: 20px;

	&::placeholder {
		color: var(--chat-color-placeholder);
	}
}

.rooms-empty {
	font-size: 14px;
	color: #9ca6af;
	font-style: italic;
	text-align: center;
	margin: 40px 0;
}

.room-list {
	-webkit-box-flex: 0;
	flex: 0 1 auto;
	position: relative;
	max-width: 100%;
	cursor: pointer;
	padding: 5px 10px;
}

.room-item {
	border-radius: 8px;
	-webkit-box-align: center;
	align-items: center;
	display: -webkit-box;
	-webkit-box-flex: 1;
	flex: 1 1 100%;
	margin-bottom: 5px;
	padding: 0 16px;
	position: relative;
	min-height: 71px;

	&:hover {
		background: var(--chat-sidemenu-bg-color-hover);
		transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
	}

	&:not(:hover) {
		transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
	}
}

.room-selected {
	color: var(--chat-sidemenu-color-active) !important;
	background: var(--chat-sidemenu-bg-color-active) !important;

	&:hover {
		background: var(--chat-sidemenu-bg-color-active) !important;
	}
}

.name-container {
	flex: 1 1;
}

.title-container {
	display: flex;
	align-items: center;
	line-height: 25px;
}

.text-ellipsis {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.room-name {
	flex: 1;
	color: var(--chat-room-color-username);
}

.text-last {
	color: var(--chat-room-color-message);
	font-size: 12px;
}

.message-new {
	color: var(--chat-room-color-username);
	font-weight: 500;
}

.text-date {
	margin-left: 5px;
	font-size: 11px;
	color: var(--chat-room-color-timestamp);
}

.icon-check {
	height: 14px;
	width: 14px;
	vertical-align: middle;
	margin-top: -2px;
	margin-right: 1px;
}

.state-circle {
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background-color: var(--chat-room-color-offline);
	margin-right: 6px;
	transition: 0.3s;
}

.state-online {
	background-color: var(--chat-room-color-online);
}
</style>
