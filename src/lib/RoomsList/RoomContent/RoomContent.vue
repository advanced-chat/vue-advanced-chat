<template>
	<div class="vac-room-container">
		<slot :name="'room-list-item_' + room.roomId">
			<slot :name="'room-list-avatar_' + room.roomId">
				<div
					v-if="room.avatar"
					class="vac-avatar"
					:style="{ 'background-image': `url('${room.avatar}')` }"
				/>
			</slot>
			<div class="vac-name-container vac-text-ellipsis">
				<div class="vac-title-container">
					<div
						v-if="userStatus"
						class="vac-state-circle"
						:class="{ 'vac-state-online': userStatus === 'online' }"
					/>
					<slot :name="'room-list-info_' + room.roomId">
						<div class="vac-room-name vac-text-ellipsis">
							{{ room.roomName }}
						</div>
					</slot>
					<div v-if="room.lastMessage" class="vac-text-date">
						{{ room.lastMessage.timestamp }}
					</div>
				</div>
				<div
					class="vac-text-last"
					:class="{
						'vac-message-new':
							room.lastMessage && room.lastMessage.new && !typingUsers
					}"
				>
					<span v-if="isMessageCheckmarkVisible">
						<slot :name="'checkmark-icon_' + room.roomId">
							<svg-icon
								:name="
									room.lastMessage.distributed
										? 'double-checkmark'
										: 'checkmark'
								"
								:param="room.lastMessage.seen ? 'seen' : ''"
								class="vac-icon-check"
							/>
						</slot>
					</span>
					<div
						v-if="room.lastMessage && !room.lastMessage.deleted && isAudio"
						class="vac-text-ellipsis"
					>
						<slot :name="'microphone-icon_' + room.roomId">
							<svg-icon name="microphone" class="vac-icon-microphone" />
						</slot>
						{{ formattedDuration }}
					</div>
					<format-message
						v-else-if="room.lastMessage"
						:message-id="room.lastMessage._id"
						:room-id="room.roomId"
						:room-list="true"
						:content="getLastMessage"
						:deleted="!!room.lastMessage.deleted && !typingUsers"
						:users="room.users"
						:text-messages="textMessages"
						:linkify="false"
						:text-formatting="textFormatting"
						:link-options="linkOptions"
						:single-line="true"
					>
						<template v-for="(idx, name) in $slots" #[name]="data">
							<slot :name="name" v-bind="data" />
						</template>
					</format-message>
					<div
						v-if="!room.lastMessage && typingUsers"
						class="vac-text-ellipsis"
					>
						{{ typingUsers }}
					</div>
					<div class="vac-room-options-container">
						<div
							v-if="room.unreadCount"
							class="vac-badge-counter vac-room-badge"
						>
							{{ room.unreadCount }}
						</div>
						<slot :name="'room-list-options_' + room.roomId">
							<div
								v-if="roomActions.length"
								class="vac-svg-button vac-list-room-options"
								@click.stop="roomMenuOpened = room.roomId"
							>
								<slot :name="'room-list-options-icon_' + room.roomId">
									<svg-icon name="dropdown" param="room" />
								</slot>
							</div>
							<transition v-if="roomActions.length" name="vac-slide-left">
								<div
									v-if="roomMenuOpened === room.roomId"
									v-click-outside="closeRoomMenu"
									class="vac-menu-options"
								>
									<div class="vac-menu-list">
										<div v-for="action in roomActions" :key="action.name">
											<div
												class="vac-menu-item"
												@click.stop="roomActionHandler(action)"
											>
												{{ action.title }}
											</div>
										</div>
									</div>
								</div>
							</transition>
						</slot>
					</div>
				</div>
			</div>
		</slot>
	</div>
</template>

<script>
import SvgIcon from '../../../components/SvgIcon/SvgIcon'
import FormatMessage from '../../../components/FormatMessage/FormatMessage'

import vClickOutside from '../../../utils/on-click-outside'
import typingText from '../../../utils/typing-text'
import { isAudioFile } from '../../../utils/media-file'

export default {
	name: 'RoomsContent',
	components: {
		SvgIcon,
		FormatMessage
	},

	directives: {
		clickOutside: vClickOutside
	},

	props: {
		currentUserId: { type: [String, Number], required: true },
		room: { type: Object, required: true },
		textFormatting: { type: Object, required: true },
		linkOptions: { type: Object, required: true },
		textMessages: { type: Object, required: true },
		roomActions: { type: Array, required: true }
	},

	emits: ['room-action-handler'],

	data() {
		return {
			roomMenuOpened: null
		}
	},

	computed: {
		getLastMessage() {
			const isTyping = this.typingUsers
			if (isTyping) return isTyping

			const content = this.room.lastMessage.content

			if (this.room.users.length <= 2) {
				return content
			}

			const user = this.room.users.find(
				user => user._id === this.room.lastMessage.senderId
			)

			if (this.room.lastMessage.username) {
				return `${this.room.lastMessage.username} - ${content}`
			} else if (!user || user._id === this.currentUserId) {
				return content
			}

			return `${user.username} - ${content}`
		},
		userStatus() {
			if (!this.room.users || this.room.users.length !== 2) return

			const user = this.room.users.find(u => u._id !== this.currentUserId)
			if (user && user.status) return user.status.state

			return null
		},
		typingUsers() {
			return typingText(this.room, this.currentUserId, this.textMessages)
		},
		isMessageCheckmarkVisible() {
			return (
				!this.typingUsers &&
				this.room.lastMessage &&
				!this.room.lastMessage.deleted &&
				this.room.lastMessage.senderId === this.currentUserId &&
				(this.room.lastMessage.saved ||
					this.room.lastMessage.distributed ||
					this.room.lastMessage.seen)
			)
		},
		formattedDuration() {
			const file = this.room.lastMessage?.files?.[0]
			if (file) {
				if (!file.duration) {
					return `${file.name}.${file.extension}`
				}

				let s = Math.floor(file.duration)
				return (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s
			}
			return ''
		},
		isAudio() {
			return this.room.lastMessage.files
				? isAudioFile(this.room.lastMessage.files[0])
				: false
		}
	},

	methods: {
		roomActionHandler(action) {
			this.closeRoomMenu()
			this.$emit('room-action-handler', { action, roomId: this.room.roomId })
		},
		closeRoomMenu() {
			this.roomMenuOpened = null
		}
	}
}
</script>
