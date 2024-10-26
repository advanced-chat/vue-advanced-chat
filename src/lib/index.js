import { defineCustomElement } from 'vue'
import ChatWindow from './ChatWindow'

export const VueAdvancedChat = defineCustomElement(ChatWindow)

const PACKAGE_NAME = 'vue-advanced-chat'

export function register() {
	if (!customElements.get(PACKAGE_NAME)) {
		customElements.define(PACKAGE_NAME, VueAdvancedChat)
	}
}

// RoomMessage components
export { default as RoomMessage } from './Room/RoomMessage/RoomMessage';
export { default as AudioPlayer } from './Room/RoomMessage/AudioPlayer/AudioPlayer.vue';
export { default as AudioControl } from './Room/RoomMessage/AudioPlayer/AudioControl/AudioControl.vue';
export { default as MessageActions } from './Room/RoomMessage/MessageActions/MessageActions.vue';
export { default as MessageFiles } from './Room/RoomMessage/MessageFiles/MessageFiles.vue';
export { default as MessageReactions } from './Room/RoomMessage/MessageReactions/MessageReactions.vue';
export { default as MessageReply } from './Room/RoomMessage/MessageReply/MessageReply.vue';
// RoomFooter components
export { default as RoomFooter } from './Room/RoomFooter/RoomFooter';
export { default as RoomEmojis } from './Room/RoomFooter/RoomEmojis/RoomEmojis.vue';
export { default as RoomMessageReply } from './Room/RoomFooter/RoomMessageReply/RoomMessageReply.vue';
export { default as RoomTemplatesText } from './Room/RoomFooter/RoomTemplatesText/RoomTemplatesText.vue';
export { default as RoomUsersTag } from './Room/RoomFooter/RoomUsersTag/RoomUsersTag.vue';
export { default as RoomFiles } from './Room/RoomFooter/RoomFiles/RoomFiles.vue';
// RoomHeader components
export { default as RoomHeader } from './Room/RoomHeader/RoomHeader';
export { default as Room } from './Room/Room.vue';
// Media components
export { default as MediaPreview } from './MediaPreview/MediaPreview.vue';
// RoomsList components
export { default as RoomsList } from './RoomsList/RoomsList.vue';
export { default as RoomsSearch } from './RoomsList/RoomsSearch/RoomsSearch.vue';
export { default as RoomContent } from './RoomsList/RoomContent/RoomContent.vue';
