<template>
	<div
		v-show="(isMobile && !showRoomsList) || !isMobile || singleRoom"
		class="vac-col-messages"
		@drop.prevent="onDropFiles"
		@dragenter.prevent
		@dragover.prevent
		@dragleave.prevent
		@touchstart="touchStart"
	>
		<!-- Audio element for JJSIP -->
		<audio ref="jjsipAudioElement" autoplay playsinline style="display: none;"></audio>

		<!-- Call UI Elements -->
		<div v-if="callError" style="padding: 10px; background-color: #f8d7da; color: #721c24; text-align: center;">
			Error: {{ callError }}
		</div>

		<!-- Incoming Call Notification -->
		<div v-if="isIncomingCall && incomingCallData" style="padding: 15px; background-color: #d4edda; color: #155724; text-align: center; border-bottom: 1px solid #c3e6cb;">
			<div>
				Incoming call from: {{ (incomingCallData.session && incomingCallData.session.remote_identity) ? incomingCallData.session.remote_identity.uri.toString() : 'Unknown' }}
			</div>
			<button @click="answerIncomingCall" style="margin: 5px; padding: 8px 15px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
				Answer
			</button>
			<button @click="declineIncomingCall" style="margin: 5px; padding: 8px 15px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
				Decline
			</button>
		</div>

		<!-- Active Call UI -->
		<div v-if="isCallActive && !isIncomingCall" style="padding: 15px; background-color: #cce5ff; color: #004085; text-align: center; border-bottom: 1px solid #b8daff;">
			<div>
				Call in progress with: {{ (jjsip_currentSession && jjsip_currentSession.remote_identity) ? jjsip_currentSession.remote_identity.uri.toString() : 'Unknown' }}
			</div>
			<button @click="endCurrentCall" style="margin: 5px; padding: 8px 15px; background-color: #ffc107; color: #212529; border: none; border-radius: 4px; cursor: pointer;">
				Hang Up
			</button>
		</div>

		<slot v-if="showNoRoom" name="no-room-selected">
			<div class="vac-container-center vac-room-empty">
				<div>{{ textMessages.ROOM_EMPTY }}</div>
			</div>
		</slot>

		<room-header
			v-else
			:current-user-id="currentUserId"
			:text-messages="textMessages"
			:single-room="singleRoom"
			:show-rooms-list="showRoomsList"
			:is-mobile="isMobile"
			:room-info-enabled="roomInfoEnabled"
			:menu-actions="menuActions"
			:room="room"
			:message-selection-enabled="messageSelectionEnabled"
			:message-selection-actions="messageSelectionActions"
			:selected-messages-total="selectedMessages.length"
			@toggle-rooms-list="$emit('toggle-rooms-list')"
			@room-info="$emit('room-info')"
			@menu-action-handler="$emit('menu-action-handler', $event)"
			@message-selection-action-handler="messageSelectionActionHandler"
			@cancel-message-selection="messageSelectionEnabled = false"
			@start-call="startCall"
		>
			<template v-for="(i, name) in $slots" #[name]="data">
				<slot :name="name" v-bind="data" />
			</template>
		</room-header>

		<div
			id="messages-list"
			ref="scrollContainer"
			class="vac-container-scroll"
			@scroll="onContainerScroll"
		>
			<loader :show="loadingMessages" type="messages">
				<template v-for="(idx, name) in $slots" #[name]="data">
					<slot :name="name" v-bind="data" />
				</template>
			</loader>
			<div class="vac-messages-container">
				<div :class="{ 'vac-messages-hidden': loadingMessages }">
					<transition name="vac-fade-message">
						<div>
							<div v-if="showNoMessages" class="vac-text-started">
								<slot name="messages-empty">
									{{ textMessages.MESSAGES_EMPTY }}
								</slot>
							</div>
							<div v-if="showMessagesStarted" class="vac-text-started">
								{{ textMessages.CONVERSATION_STARTED }} {{ messages[0].date }}
							</div>
						</div>
					</transition>
					<div
						v-if="messages.length && !messagesLoaded"
						id="infinite-loader-messages"
					>
						<loader :show="true" :infinite="true" type="infinite-messages">
							<template v-for="(idx, name) in $slots" #[name]="data">
								<slot :name="name" v-bind="data" />
							</template>
						</loader>
					</div>
					<transition-group :key="roomId" name="vac-fade-message" tag="span">
						<div v-for="(m, i) in messages" :key="m.indexId || m._id">
							<room-message
								:current-user-id="currentUserId"
								:message="m"
								:index="i"
								:messages="messages"
								:edited-message-id="editedMessageId"
								:message-actions="messageActions"
								:room-users="room.users"
								:text-messages="textMessages"
								:new-messages="newMessages"
								:show-reaction-emojis="showReactionEmojis"
								:show-new-messages-divider="showNewMessagesDivider"
								:text-formatting="textFormatting"
								:link-options="linkOptions"
								:username-options="usernameOptions"
								:message-selection-enabled="messageSelectionEnabled"
								:selected-messages="selectedMessages"
								:emoji-data-source="emojiDataSource"
								@message-added="onMessageAdded"
								@message-action-handler="messageActionHandler"
								@open-file="openFile"
								@open-user-tag="openUserTag"
								@open-failed-message="$emit('open-failed-message', $event)"
								@send-message-reaction="sendMessageReaction"
								@select-message="selectMessage"
								@unselect-message="unselectMessage"
							>
								<template v-for="(idx, name) in $slots" #[name]="data">
									<slot :name="name" v-bind="data" />
								</template>
							</room-message>
						</div>
					</transition-group>
				</div>
			</div>
		</div>
		<div v-if="!loadingMessages">
			<transition name="vac-bounce">
				<div v-if="scrollIcon" class="vac-icon-scroll" @click="scrollToBottom">
					<transition name="vac-bounce">
						<div
							v-if="scrollMessagesCount"
							class="vac-badge-counter vac-messages-count"
						>
							{{ scrollMessagesCount }}
						</div>
					</transition>
					<slot name="scroll-icon">
						<svg-icon name="dropdown" param="scroll" />
					</slot>
				</div>
			</transition>
		</div>

		<room-footer
			:room="room"
			:room-id="roomId"
			:room-message="roomMessage"
			:text-messages="textMessages"
			:show-send-icon="showSendIcon"
			:show-files="showFiles"
			:show-audio="showAudio"
			:show-emojis="showEmojis"
			:show-footer="showFooter"
			:accepted-files="acceptedFiles"
			:capture-files="captureFiles"
			:multiple-files="multipleFiles"
			:textarea-action-enabled="textareaActionEnabled"
			:textarea-auto-focus="textareaAutoFocus"
			:user-tags-enabled="userTagsEnabled"
			:emojis-suggestion-enabled="emojisSuggestionEnabled"
			:templates-text="templatesText"
			:text-formatting="textFormatting"
			:link-options="linkOptions"
			:audio-bit-rate="audioBitRate"
			:audio-sample-rate="audioSampleRate"
			:init-reply-message="initReplyMessage"
			:init-edit-message="initEditMessage"
			:dropped-files="droppedFiles"
			:emoji-data-source="emojiDataSource"
			@update-edited-message-id="editedMessageId = $event"
			@edit-message="$emit('edit-message', $event)"
			@send-message="$emit('send-message', $event)"
			@typing-message="$emit('typing-message', $event)"
			@textarea-action-handler="$emit('textarea-action-handler', $event)"
		>
			<template v-for="(idx, name) in $slots" #[name]="data">
				<slot :name="name" v-bind="data" />
			</template>
		</room-footer>
	</div>
</template>

<script>
import Loader from '../../components/Loader/Loader'
import SvgIcon from '../../components/SvgIcon/SvgIcon'

import RoomHeader from './RoomHeader/RoomHeader'
import RoomFooter from './RoomFooter/RoomFooter'
import RoomMessage from './RoomMessage/RoomMessage'

import * as jjsipService from '../../services/jjsipService'

export default {
	name: 'ChatRoom',
	components: {
		Loader,
		SvgIcon,
		RoomHeader,
		RoomFooter,
		RoomMessage
	},

	props: {
		currentUserId: { type: [String, Number], required: true },
		textMessages: { type: Object, required: true },
		singleRoom: { type: Boolean, required: true },
		showRoomsList: { type: Boolean, required: true },
		isMobile: { type: Boolean, required: true },
		rooms: { type: Array, required: true },
		roomId: { type: [String, Number], required: true },
		loadFirstRoom: { type: Boolean, required: true },
		messages: { type: Array, required: true },
		roomMessage: { type: String, default: null },
		messagesLoaded: { type: Boolean, required: true },
		menuActions: { type: Array, required: true },
		messageActions: { type: Array, required: true },
		messageSelectionActions: { type: Array, required: true },
		autoScroll: { type: Object, required: true },
		showSendIcon: { type: Boolean, required: true },
		showFiles: { type: Boolean, required: true },
		showAudio: { type: Boolean, required: true },
		audioBitRate: { type: Number, required: true },
		audioSampleRate: { type: Number, required: true },
		showEmojis: { type: Boolean, required: true },
		showReactionEmojis: { type: Boolean, required: true },
		showNewMessagesDivider: { type: Boolean, required: true },
		showFooter: { type: Boolean, required: true },
		acceptedFiles: { type: String, required: true },
		captureFiles: { type: String, required: true },
		multipleFiles: { type: Boolean, default: true },
		textFormatting: { type: Object, required: true },
		linkOptions: { type: Object, required: true },
		loadingRooms: { type: Boolean, required: true },
		roomInfoEnabled: { type: Boolean, required: true },
		textareaActionEnabled: { type: Boolean, required: true },
		textareaAutoFocus: { type: Boolean, required: true },
		userTagsEnabled: { type: Boolean, required: true },
		emojisSuggestionEnabled: { type: Boolean, required: true },
		scrollDistance: { type: Number, required: true },
		templatesText: { type: Array, default: null },
		usernameOptions: { type: Object, required: true },
		emojiDataSource: { type: String, default: undefined },

		// JJSIP Props
		jjsipSipUri: { type: String, default: 'sip:defaultroomuser@example.com' },
		jjsipPassword: { type: String, default: 'roompassword' },
		jjsipWebSocketServer: { type: String, default: 'wss://defaultroomws.example.com' },
		jjsipDisplayName: { type: String, default: 'Default Room User' }
	},

	emits: [
		'toggle-rooms-list',
		'room-info',
		'menu-action-handler',
		'message-selection-action-handler',
		'edit-message',
		'send-message',
		'delete-message',
		'message-action-handler',
		'fetch-messages',
		'send-message-reaction',
		'typing-message',
		'open-file',
		'open-user-tag',
		'open-failed-message',
		'textarea-action-handler'
	],

	data() {
		return {
			editedMessageId: null,
			initReplyMessage: null,
			initEditMessage: null,
			loadingMessages: false,
			observer: null,
			showLoader: true,
			loadingMoreMessages: false,
			scrollIcon: false,
			scrollMessagesCount: 0,
			newMessages: [],
			messageSelectionEnabled: false,
			selectedMessages: [],
			droppedFiles: [],

			// JJSIP related data
			jjsip_ua: null,
			jjsip_currentSession: null,
			isCallActive: false,
			isIncomingCall: false,
			incomingCallData: null, 
			callError: null
		}
	},

	computed: {
		room() {
			return this.rooms.find(room => room.roomId === this.roomId) || {}
		},
		showNoMessages() {
			return (
				this.roomId &&
				!this.messages.length &&
				!this.loadingMessages &&
				!this.loadingRooms
			)
		},
		showNoRoom() {
			const noRoomSelected =
				(!this.rooms.length && !this.loadingRooms) ||
				(!this.roomId && !this.loadFirstRoom)

			if (noRoomSelected) {
				this.updateLoadingMessages(false)
			}
			return noRoomSelected
		},
		showMessagesStarted() {
			return this.messages.length && this.messagesLoaded
		}
	},

	watch: {
		roomId: {
			immediate: true,
			handler() {
				this.onRoomChanged()
			}
		},
		messages: {
			deep: true,
			handler(newVal, oldVal) {
				newVal.forEach((message, i) => {
					if (
						this.showNewMessagesDivider &&
						!message.seen &&
						message.senderId !== this.currentUserId
					) {
						this.newMessages.push({
							_id: message._id,
							index: i
						})
					}
				})
				if (oldVal?.length === newVal?.length - 1) {
					this.newMessages = []
				}
				setTimeout(() => (this.loadingMoreMessages = false))
			}
		},
		messagesLoaded(val) {
			if (val) this.updateLoadingMessages(false)
		}
	},

	mounted() {
		this.newMessages = []
		this.initializeJJsip()
	},

	methods: {
    initializeJJsip() {
      const config = {
        sipUri: this.jjsipSipUri,
        password: this.jjsipPassword,
        wsServer: this.jjsipWebSocketServer,
        displayName: this.jjsipDisplayName
      };

      console.log('[Room.vue] Initializing JJSIP with config from props:', config);
      this.callError = null;
      try {
        const ua = jjsipService.initJJsip(config);
        if (ua) {
          this.jjsip_ua = ua;
          console.log('[Room.vue] JJSIP UA initialized successfully:', ua);
          
          ua.on('new_session', (sessionData) => {
            console.log('[Room.vue] JJSIP UA new_session event (incoming call):', sessionData);
            this.handleIncomingCall({ session: sessionData.session });
          });

          ua.on('registered', () => {
            console.log('[Room.vue] JJSIP UA registered.');
            this.callError = null; 
          });

          ua.on('unregistered', () => {
            console.warn('[Room.vue] JJSIP UA unregistered.');
          });
          
          ua.on('registrationFailed', (data) => {
            console.error('[Room.vue] JJSIP UA registrationFailed event:', data);
            this.handleRegistrationFailed(data);
          });
        } else {
          console.error('[Room.vue] JJSIP UA initialization failed. UA instance not returned.');
          this.callError = 'JJSIP initialization failed. UA not available.';
        }
      } catch (error) {
        console.error('[Room.vue] Error during JJSIP initialization:', error);
        this.callError = `JJSIP initialization error: ${error.message}`;
      }
    },

    startCall() {
      if (!this.jjsip_ua) {
        this.callError = 'JJSIP not initialized. Cannot start call.';
        console.error(this.callError);
        return;
      }
      const targetUri = 'sip:user200@example.com'; // Placeholder
      console.log(`[Room.vue] Attempting to start call to ${targetUri}`);

      const session = jjsipService.makeCall(targetUri);
      if (session) {
        this.jjsip_currentSession = session;
        this.isCallActive = true;
        this.isIncomingCall = false;
        this.incomingCallData = null; 
        this.callError = null;
        console.log('[Room.vue] Outgoing call initiated. Session:', session);
        
        session.on('accepted', () => {
            console.log('[Room.vue] Outgoing call accepted by remote.');
            this.isCallActive = true; 
            this.isIncomingCall = false;
            this.callError = null;
            if (this.jjsip_currentSession && this.$refs.jjsipAudioElement) {
              console.log('[Room.vue] Calling setRemoteAudioElement for outgoing call.');
              jjsipService.setRemoteAudioElement(this.jjsip_currentSession, this.$refs.jjsipAudioElement);
            }
        });
        session.on('ended', () => {
            console.log('[Room.vue] Outgoing call ended.');
            this.isCallActive = false;
            if (this.jjsip_currentSession === session) {
              this.jjsip_currentSession = null;
            }
        });
        session.on('failed', (data) => {
            console.error('[Room.vue] Outgoing call failed:', data);
            this.isCallActive = false;
            if (this.jjsip_currentSession === session) {
              this.jjsip_currentSession = null;
            }
            this.callError = 'Call failed to connect.';
        });
      } else {
        this.callError = 'Failed to start call (session is null).';
        console.error('[Room.vue] Failed to start call, session is null.');
      }
    },

    answerIncomingCall() {
      if (!this.incomingCallData || !this.incomingCallData.session) {
        this.callError = 'No incoming call data to answer.';
        console.error(this.callError);
        return;
      }
      console.log('[Room.vue] Answering incoming call. Session:', this.incomingCallData.session);
      const incomingSession = this.incomingCallData.session;
      jjsipService.answerCall(incomingSession); 

      this.jjsip_currentSession = incomingSession; 
      this.isCallActive = true;
      this.isIncomingCall = false;
      this.callError = null;

      if (this.jjsip_currentSession) {
        this.jjsip_currentSession.on('accepted', () => {
             console.log('[Room.vue] Incoming call successfully accepted/connected (from Room.vue session.on "accepted").');
             this.isCallActive = true; 
             this.isIncomingCall = false; 
             this.incomingCallData = null; 
             if (this.$refs.jjsipAudioElement) {
               console.log('[Room.vue] Calling setRemoteAudioElement for incoming call.');
               jjsipService.setRemoteAudioElement(this.jjsip_currentSession, this.$refs.jjsipAudioElement);
             }
        });

        this.jjsip_currentSession.on('ended', () => {
            console.log('[Room.vue] Answered call ended (from Room.vue session.on "ended").');
            this.isCallActive = false;
            if (this.jjsip_currentSession === incomingSession) { 
                this.jjsip_currentSession = null;
            }
            this.incomingCallData = null; 
        });
        this.jjsip_currentSession.on('failed', (data) => {
             console.error('[Room.vue] Answered call failed (from Room.vue session.on "failed").', data);
            this.isCallActive = false;
            if (this.jjsip_currentSession === incomingSession) {
                this.jjsip_currentSession = null;
            }
            this.incomingCallData = null; 
            this.callError = 'Call failed after answering.';
        });
      } else {
        this.incomingCallData = null;
      }
    },

    declineIncomingCall() {
      if (!this.incomingCallData || !this.incomingCallData.session) {
        this.callError = 'No incoming call data to decline.';
        return;
      }
      jjsipService.hangupCall(this.incomingCallData.session); 
      this.isIncomingCall = false;
      this.incomingCallData = null;
      this.callError = null;
      this.isCallActive = false; 
    },

    endCurrentCall() {
      if (!this.jjsip_currentSession) {
        this.callError = 'No active call to end.';
        return;
      }
      jjsipService.hangupCall(this.jjsip_currentSession);
      this.isCallActive = false;
      this.jjsip_currentSession = null;
      this.isIncomingCall = false; 
      this.incomingCallData = null; 
      this.callError = null;
    },

    handleIncomingCall(data) { 
      if (!data || !data.session) {
        console.error('[Room.vue] Invalid data for handleIncomingCall:', data);
        return;
      }
      this.incomingCallData = { session: data.session }; 
      this.isIncomingCall = true;
      this.isCallActive = false; 
      this.callError = null;
    },

    handleRegistrationFailed(data) {
      this.callError = `SIP Registration Failed: ${data?.cause || 'Unknown cause'}.`;
    },

		updateLoadingMessages(val) {
			this.loadingMessages = val
			if (!val) {
				setTimeout(() => this.initIntersectionObserver())
			}
		},
		initIntersectionObserver() {
			if (this.observer) {
				this.showLoader = true
				this.observer.disconnect()
			}
			const loader = this.$el.querySelector('#infinite-loader-messages')
			if (loader) {
				const options = {
					root: this.$el.querySelector('#messages-list'),
					rootMargin: `${this.scrollDistance}px`,
					threshold: 0
				}
				this.observer = new IntersectionObserver(entries => {
					if (entries[0].isIntersecting) {
						this.loadMoreMessages()
					}
				}, options)
				this.observer.observe(loader)
			}
		},
		preventTopScroll() {
			const container = this.$refs.scrollContainer
			const prevScrollHeight = container.scrollHeight
			const observer = new ResizeObserver(_ => {
				if (container.scrollHeight !== prevScrollHeight) {
					if (this.$refs.scrollContainer) {
						this.$refs.scrollContainer.scrollTo({
							top: container.scrollHeight - prevScrollHeight
						})
						observer.disconnect()
					}
				}
			})
			for (var i = 0; i < container.children.length; i++) {
				observer.observe(container.children[i])
			}
		},
		touchStart(touchEvent) {
			if (this.singleRoom) return
			if (touchEvent.changedTouches.length === 1) {
				const posXStart = touchEvent.changedTouches[0].clientX
				const posYStart = touchEvent.changedTouches[0].clientY
				addEventListener(
					'touchend',
					touchEvent => this.touchEnd(touchEvent, posXStart, posYStart),
					{ once: true }
				)
			}
		},
		touchEnd(touchEvent, posXStart, posYStart) {
			if (touchEvent.changedTouches.length === 1) {
				const posXEnd = touchEvent.changedTouches[0].clientX
				const posYEnd = touchEvent.changedTouches[0].clientY
				const swippedRight = posXEnd - posXStart > 100
				const swippedVertically = Math.abs(posYEnd - posYStart) > 50
				if (swippedRight && !swippedVertically) {
					this.$emit('toggle-rooms-list')
				}
			}
		},
		onRoomChanged() {
			this.updateLoadingMessages(true)
			this.scrollIcon = false
			this.scrollMessagesCount = 0
			this.resetMessageSelection()
			const unwatch = this.$watch(
				() => this.messages,
				val => {
					if (!val || !val.length) return
					const element = this.$refs.scrollContainer
					if (!element) return
					unwatch()
					setTimeout(() => {
						element.scrollTo({ top: element.scrollHeight })
						this.updateLoadingMessages(false)
					})
				}
			)
		},
		resetMessageSelection() {
			this.messageSelectionEnabled = false
			this.selectedMessages = []
		},
		selectMessage(message) {
			this.selectedMessages.push(message)
		},
		unselectMessage(messageId) {
			this.selectedMessages = this.selectedMessages.filter(
				message => message._id !== messageId
			)
		},
		onMessageAdded({ message, index, ref }) {
			if (index !== this.messages.length - 1) return
			const autoScrollOffset = ref.offsetHeight + 60
			setTimeout(() => {
				const scrollContainer = this.$refs.scrollContainer
				let scrolledUp = false
				if (scrollContainer) {
					scrolledUp = this.getBottomScroll(scrollContainer) > autoScrollOffset
				}
				if (message.senderId === this.currentUserId) {
					if (scrolledUp) {
						if (this.autoScroll.send.newAfterScrollUp) this.scrollToBottom()
					} else {
						if (this.autoScroll.send.new) this.scrollToBottom()
					}
				} else {
					if (scrolledUp) {
						if (this.autoScroll.receive.newAfterScrollUp) this.scrollToBottom()
						else {
							this.scrollIcon = true
							this.scrollMessagesCount++
						}
					} else {
						if (this.autoScroll.receive.new) this.scrollToBottom()
						else {
							this.scrollIcon = true
							this.scrollMessagesCount++
						}
					}
				}
			})
		},
		onContainerScroll(e) {
			if (!e.target) return
			const bottomScroll = this.getBottomScroll(e.target)
			if (bottomScroll < 60) this.scrollMessagesCount = 0
			this.scrollIcon = bottomScroll > 500 || this.scrollMessagesCount
		},
		loadMoreMessages() {
			if (this.loadingMessages) return
			setTimeout(() => {
				if (this.loadingMoreMessages) return
				if (this.messagesLoaded || !this.roomId) {
					this.loadingMoreMessages = false
					this.showLoader = false
					return
				}
				this.preventTopScroll()
				this.$emit('fetch-messages')
				this.loadingMoreMessages = true
			}, 500)
		},
		messageActionHandler({ action, message }) {
			switch (action.name) {
				case 'replyMessage':
					this.initReplyMessage = message
					setTimeout(() => { this.initReplyMessage = null })
					return
				case 'editMessage':
					this.initEditMessage = message
					setTimeout(() => { this.initEditMessage = null })
					return
				case 'deleteMessage':
					return this.$emit('delete-message', message)
				case 'selectMessages':
					this.selectedMessages = [message]
					this.messageSelectionEnabled = true
					return
				default:
					return this.$emit('message-action-handler', { action, message })
			}
		},
		messageSelectionActionHandler(action) {
			this.$emit('message-selection-action-handler', {
				action,
				messages: this.selectedMessages
			})
			this.resetMessageSelection()
		},
		sendMessageReaction(messageReaction) {
			this.$emit('send-message-reaction', messageReaction)
		},
		getBottomScroll(element) {
			const { scrollHeight, clientHeight, scrollTop } = element
			return scrollHeight - clientHeight - scrollTop
		},
		scrollToBottom() {
			setTimeout(() => {
				const element = this.$refs.scrollContainer
				if (element) {
					element.classList.add('vac-scroll-smooth')
					element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' })
					setTimeout(() => element.classList.remove('vac-scroll-smooth'))
				}
			}, 50)
		},
		openFile({ message, file }) {
			this.$emit('open-file', { message, file })
		},
		openUserTag(user) {
			this.$emit('open-user-tag', user)
		},
		onDropFiles(event) {
			if (this.showFiles) {
				this.droppedFiles = event.dataTransfer.files
			}
		}
	}
}
</script>
