<template>
	<div class="vac-room-header vac-app-border-b">
		<slot name="room-header">
			<div class="vac-room-wrapper">
				<transition name="vac-slide-up">
					<div v-if="messageSelectionEnabled" class="vac-room-selection">
            <div
              class="vac-selection-cancel"
              @click="$emit('cancel-message-selection')"
            >
              <span class="x-icon vac-item-clickable">
                <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" fill="currentColor" enable-background="new 0 0 24 24" xml:space="preserve">
                  <path d="M19.6004 17.2L14.3004 11.9L19.6004 6.60005L17.8004 4.80005L12.5004 10.2L7.20039 4.90005L5.40039 6.60005L10.7004 11.9L5.40039 17.2L7.20039 19L12.5004 13.7L17.8004 19L19.6004 17.2Z" />
                </svg>
              </span>

              <div class="vac-selection-count-container">
               <span class="vac-selection-button-count">
									{{ selectedMessagesTotal }}
               </span>
                {{ textMessages.COUNT_SELECT_MESSAGE }}
              </div>
          </div>
						<div
							v-for="action in messageSelectionActions"
							:id="action.name"
							:key="action.name"
						>
              <div v-if="action.name === 'forwardMessages'" class="vac-item-clickable forward-messages" :title="action.title" @click="messageSelectionActionHandler(action)">
                  <span>
                    <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24" xml:space="preserve">
                      <path fill="currentColor" d="M14.278,4.813c0-0.723,0.873-1.085,1.383-0.574l6.045,6.051 c0.317,0.317,0.317,0.829,0,1.146l-6.045,6.051c-0.51,0.51-1.383,0.149-1.383-0.574v-2.732c-5.096,0-8.829,1.455-11.604,4.611 c-0.246,0.279-0.702,0.042-0.602-0.316C3.502,13.303,6.997,8.472,14.278,7.431V4.813z" />
                    </svg>
                  </span>
              </div>

							<div
                v-else
								class="vac-selection-button"
								@click="messageSelectionActionHandler(action)"
							>
								{{ action.title }}
              </div>
						</div>
					</div>
				</transition>
				<template
					v-if="!messageSelectionEnabled && messageSelectionAnimationEnded"
				>
					<div
						v-if="!singleRoom"
						class="vac-svg-button vac-toggle-button"
						:class="{
							'vac-rotate-icon-init': !isMobile,
							'vac-rotate-icon': !showRoomsList && !isMobile
						}"
						@click="$emit('toggle-rooms-list')"
					>
						<slot name="toggle-icon">
							<svg-icon name="toggle" />
						</slot>
					</div>
					<div
						class="vac-info-wrapper"
						:class="{ 'vac-item-clickable': roomInfoEnabled }"
						@click="$emit('room-info')"
					>
						<slot name="room-header-avatar">
							<div
								v-if="room.avatar"
								class="vac-avatar"
								:style="{ 'background-image': `url('${room.avatar}')` }"
							/>
						</slot>
						<slot name="room-header-info">
							<div class="vac-text-ellipsis">
								<div class="vac-room-name vac-text-ellipsis">
									{{ room.roomName }}
								</div>
								<div v-if="typingUsers" class="vac-room-info vac-text-ellipsis">
									{{ typingUsers }}
								</div>
								<div v-else-if="room.roomInfo" class="vac-room-info vac-text-ellipsis">
									{{ room.roomInfo }}
								</div>
								<div v-else class="vac-room-info vac-text-ellipsis">
									{{ userStatus }}
								</div>
							</div>
						</slot>
					</div>
					<slot v-if="room.roomId" name="room-options">
						<div
							v-if="menuActions.length"
							class="vac-svg-button vac-room-options"
							@click="menuOpened = !menuOpened"
						>
							<slot name="menu-icon">
								<svg-icon name="menu" />
							</slot>
						</div>
						<transition v-if="menuActions.length" name="vac-slide-left">
							<div
								v-if="menuOpened"
								v-click-outside="closeMenu"
								class="vac-menu-options"
							>
								<div class="vac-menu-list">
									<div v-for="action in menuActions" :key="action.name">
										<div
											class="vac-menu-item"
											@click="menuActionHandler(action)"
										>
											{{ action.title }}
										</div>
									</div>
								</div>
							</div>
						</transition>
					</slot>
				</template>
			</div>
		</slot>
	</div>
</template>

<script>
import SvgIcon from '../../../components/SvgIcon/SvgIcon'

import vClickOutside from '../../../utils/on-click-outside'
import typingText from '../../../utils/typing-text'

export default {
	name: 'RoomHeader',
	components: {
		SvgIcon
	},

	directives: {
		clickOutside: vClickOutside
	},

	props: {
		currentUserId: { type: [String, Number], required: true },
		textMessages: { type: Object, required: true },
		singleRoom: { type: Boolean, required: true },
		showRoomsList: { type: Boolean, required: true },
		isMobile: { type: Boolean, required: true },
		roomInfoEnabled: { type: Boolean, required: true },
		menuActions: { type: Array, required: true },
		room: { type: Object, required: true },
		messageSelectionEnabled: { type: Boolean, required: true },
		messageSelectionActions: { type: Array, required: true },
		selectedMessagesTotal: { type: Number, required: true }
	},

	emits: [
		'toggle-rooms-list',
		'room-info',
		'menu-action-handler',
		'cancel-message-selection',
		'message-selection-action-handler'
	],

	data() {
		return {
			menuOpened: false,
			messageSelectionAnimationEnded: true
		}
	},

	computed: {
		typingUsers() {
			return typingText(this.room, this.currentUserId, this.textMessages)
		},
		userStatus() {
			if (!this.room.users || this.room.users.length !== 2) return

			const user = this.room.users.find(u => u._id !== this.currentUserId)

			if (!user?.status) return

			let text = ''

			if (user.status.state === 'online') {
				text = this.textMessages.IS_ONLINE
			} else if (user.status.lastChanged) {
				text = this.textMessages.LAST_SEEN + user.status.lastChanged
			}

			return text
		}
	},

	watch: {
		messageSelectionEnabled(val) {
			if (val) {
				this.messageSelectionAnimationEnded = false
			} else {
				setTimeout(() => {
					this.messageSelectionAnimationEnded = true
				}, 300)
			}
		}
	},

	methods: {
		menuActionHandler(action) {
			this.closeMenu()
			this.$emit('menu-action-handler', action)
		},
		closeMenu() {
			this.menuOpened = false
		},
		messageSelectionActionHandler(action) {
			this.$emit('message-selection-action-handler', action)
		}
	}
}
</script>
