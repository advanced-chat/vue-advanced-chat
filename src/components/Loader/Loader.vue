<template>
	<transition name="vac-fade-spinner" appear>
		<div
			v-if="show"
			class="vac-loader-wrapper"
			:class="{
				'vac-container-center': !infinite,
				'vac-container-top': infinite
			}"
		>
			<slot v-if="type === 'rooms'" name="spinner-icon-rooms">
				<div id="vac-circle" />
			</slot>
			<slot v-if="type === 'infinite-rooms'" name="spinner-icon-infinite-rooms">
				<div id="vac-circle" />
			</slot>
			<slot
				v-if="type === 'message-file'"
				:name="'spinner-icon-message-file_' + messageId"
			>
				<div id="vac-circle" />
			</slot>
			<slot v-if="type === 'room-file'" name="spinner-icon-room-file">
				<div id="vac-circle" />
			</slot>
			<slot v-if="type === 'messages'" name="spinner-icon-messages">
				<div id="vac-circle" />
			</slot>
			<slot
				v-if="type === 'infinite-messages'"
				name="spinner-icon-infinite-messages"
			>
				<div id="vac-circle" />
			</slot>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'AppLoader',

	props: {
		show: { type: Boolean, default: false },
		infinite: { type: Boolean, default: false },
		type: { type: String, required: true },
		messageId: { type: String, default: '' }
	}
}
</script>
