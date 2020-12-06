<template>
	<div
		class="vac-rooms-container vac-app-border-r"
		:class="{ 'vac-rooms-container-full': isMobile }"
		v-show="showRoomsList"
	>
		<slot name="rooms-header"></slot>

		<div class="vac-box-search">
			<div class="vac-icon-search" v-if="!loadingRooms && rooms.length">
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
				@input="searchRoom"
			/>
			<div
				v-if="showAddRoom"
				class="vac-svg-button vac-add-icon"
				@click="addRoom"
			>
				<slot name="add-icon">
					<svg-icon name="add" />
				</slot>
			</div>
		</div>

		<loader :show="loadingRooms"></loader>

		<div v-if="!loadingRooms && !rooms.length" class="vac-rooms-empty">
			<slot name="rooms-empty">
				{{ textMessages.ROOMS_EMPTY }}
			</slot>
		</div>

		<div v-if="!loadingRooms" class="vac-room-list">
			<div
				class="vac-room-item"
				v-for="room in filteredRooms"
				:key="room.roomId"
				:class="{ 'vac-room-selected': selectedRoomId === room.roomId }"
				@click="openRoom(room)"
			>
				<slot name="room-list-item" v-bind="{ room }">
					<div
						v-if="room.avatar"
						class="vac-room-avatar"
						:style="{ 'background-image': `url('${room.avatar}')` }"
					></div>
					<div class="vac-name-container vac-text-ellipsis">
						<div class="vac-title-container">
							<div
								v-if="userStatus(room)"
								class="vac-state-circle"
								:class="{ 'vac-state-online': userStatus(room) === 'online' }"
							></div>
							<div class="vac-room-name vac-text-ellipsis">
								{{ room.roomName }}
							</div>
							<div v-if="room.lastMessage" class="vac-text-date">
								{{ room.lastMessage.timestamp }}
							</div>
						</div>
						<div
							class="vac-text-last"
							:class="{
								'vac-message-new':
									room.lastMessage && room.lastMessage.new && !typingUsers(room)
							}"
						>
							<span v-if="isMessageCheckmarkVisible(room)">
								<slot name="checkmark-icon" v-bind="room.lastMessage">
									<svg-icon
										:name="
											room.lastMessage.distributed
												? 'double-checkmark'
												: 'checkmark'
										"
										:param="room.lastMessage.seen ? 'seen' : ''"
										class="vac-icon-check"
									></svg-icon>
								</slot>
							</span>
							<div
								v-if="
									room.lastMessage &&
										!room.lastMessage.deleted &&
										room.lastMessage.file &&
										room.lastMessage.file.audio
								"
								class="vac-text-ellipsis"
							>
								<slot name="microphone-icon">
									<svg-icon name="microphone" class="vac-icon-microphone" />
								</slot>
								{{ formattedDuration(room.lastMessage.file.duration) }}
							</div>
							<format-message
								v-else-if="room.lastMessage"
								:content="getLastMessage(room)"
								:deleted="!!room.lastMessage.deleted && !typingUsers(room)"
								:formatLinks="false"
								:textFormatting="textFormatting"
								:singleLine="true"
							>
								<template v-slot:deleted-icon="data">
									<slot name="deleted-icon" v-bind="data"></slot>
								</template>
							</format-message>
							<div
								v-if="!room.lastMessage && typingUsers(room)"
								class="vac-text-ellipsis"
							>
								{{ typingUsers(room) }}
							</div>
							<div v-if="room.unreadCount" class="vac-room-badge">
								{{ room.unreadCount }}
							</div>
						</div>
					</div>
				</slot>
			</div>
		</div>
	</div>
</template>

<script>
import Loader from './Loader'
import SvgIcon from './SvgIcon'
import FormatMessage from './FormatMessage'

import filteredUsers from '../utils/filterItems'
import typingText from '../utils/typingText'

export default {
	name: 'rooms-list',
	components: { Loader, SvgIcon, FormatMessage },

	props: {
		currentUserId: { type: [String, Number], required: true },
		textMessages: { type: Object, required: true },
		showRoomsList: { type: Boolean, required: true },
		showAddRoom: { type: Boolean, required: true },
		textFormatting: { type: Boolean, required: true },
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
			this.filteredRooms = val
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
			this.$emit('fetchRoom', { room })
		},
		addRoom() {
			this.$emit('addRoom')
		},
		userStatus(room) {
			if (!room.users || room.users.length !== 2) return

			const user = room.users.find(u => u._id !== this.currentUserId)

			if (user.status) return user.status.state
		},
		typingUsers(room) {
			return typingText(room, this.currentUserId, this.textMessages)
		},
		getLastMessage(room) {
			const isTyping = this.typingUsers(room)
			if (isTyping) return isTyping

			const content = room.lastMessage.deleted
				? this.textMessages.MESSAGE_DELETED
				: room.lastMessage.content

			if (room.users.length <= 2) {
				return content
			}

			const user = room.users.find(
				user => user._id === room.lastMessage.sender_id
			)

			if (room.lastMessage.username) {
				return `${room.lastMessage.username} - ${content}`
			} else if (!user || user._id === this.currentUserId) {
				return content
			}

			return `${user.username} - ${content}`
		},
		formattedDuration(s) {
			s = Math.round(s)
			return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
		},
		isMessageCheckmarkVisible(room) {
			return (
				!this.typingUsers(room) &&
				room.lastMessage &&
				!room.lastMessage.deleted &&
				room.lastMessage.sender_id === this.currentUserId &&
				(room.lastMessage.saved ||
					room.lastMessage.distributed ||
					room.lastMessage.seen)
			)
		}
	}
}
</script>

<style lang="scss" scoped>
.vac-rooms-container {
	display: flex;
	flex-flow: column;
	flex: 0 0 25%;
	min-width: 260px;
	max-width: 500px;
	position: relative;
	background: var(--chat-sidemenu-bg-color);
	height: 100%;
	border-top-left-radius: var(--chat-container-border-radius);
	border-bottom-left-radius: var(--chat-container-border-radius);
}

.vac-rooms-container-full {
	flex: 0 0 100%;
	max-width: 100%;
}

.vac-box-search {
	position: sticky;
	display: flex;
	align-items: center;
	height: 64px;
	padding: 0 15px;
}

.vac-icon-search {
	display: flex;
	position: absolute;
	left: 30px;

	svg {
		width: 18px;
		height: 18px;
	}
}

.vac-add-icon {
	margin-left: auto;
	padding-left: 10px;
}

.vac-input {
	height: 38px;
	width: 100%;
	background: var(--chat-bg-color-input);
	color: var(--chat-color);
	border-radius: 4px;
	font-size: 15px;
	outline: 0;
	caret-color: var(--chat-color-caret);
	padding: 10px 10px 10px 40px;
	border: 1px solid var(--chat-sidemenu-border-color-search);
	border-radius: 20px;

	&::placeholder {
		color: var(--chat-color-placeholder);
	}
}

.vac-rooms-empty {
	font-size: 14px;
	color: #9ca6af;
	font-style: italic;
	text-align: center;
	margin: 40px 0;
	line-height: 20px;
	white-space: pre-line;
}

.vac-room-list {
	flex: 1;
	position: relative;
	max-width: 100%;
	cursor: pointer;
	padding: 0 10px 5px;
	overflow-y: auto;
}

.vac-room-item {
	border-radius: 8px;
	align-items: center;
	display: flex;
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

.vac-room-selected {
	color: var(--chat-sidemenu-color-active) !important;
	background: var(--chat-sidemenu-bg-color-active) !important;

	&:hover {
		background: var(--chat-sidemenu-bg-color-active) !important;
	}
}

.vac-name-container {
	flex: 1;
}

.vac-title-container {
	display: flex;
	align-items: center;
	line-height: 25px;
}

.vac-text-ellipsis {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.vac-room-name {
	flex: 1;
	color: var(--chat-room-color-username);
	font-weight: 500;
}

.vac-text-last {
	display: flex;
	align-items: center;
	font-size: 12px;
	line-height: 19px;
	color: var(--chat-room-color-message);
}

.vac-message-new {
	color: var(--chat-room-color-username);
	font-weight: 500;
}

.vac-text-date {
	margin-left: 5px;
	font-size: 11px;
	color: var(--chat-room-color-timestamp);
}

.vac-icon-check {
	display: flex;
	height: 14px;
	width: 14px;
	margin-top: -2px;
	margin-right: 2px;
}

.vac-state-circle {
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background-color: var(--chat-room-color-offline);
	margin-right: 6px;
	transition: 0.3s;
}

.vac-state-online {
	background-color: var(--chat-room-color-online);
}

.vac-icon-microphone {
	height: 15px;
	width: 15px;
	vertical-align: middle;
	margin: -3px 1px 0 -2px;
	fill: var(--chat-room-color-message);
}

.vac-room-badge {
	background-color: var(--chat-room-bg-color-badge);
	color: var(--chat-room-color-badge);
	font-size: 11px;
	font-weight: 500;
	height: 13px;
	width: auto;
	min-width: 13px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 3px;
}

@media only screen and (max-width: 768px) {
	.vac-box-search {
		height: 58px;
	}

	.vac-room-list {
		padding: 0 7px 5px;
	}

	.vac-room-item {
		min-height: 60px;
		padding: 0 8px;
	}
}
</style>
