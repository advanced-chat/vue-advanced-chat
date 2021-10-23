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
			<slot name="spinner-icon" v-bind="{ show, infinite }">
				<div id="vac-circle" />
			</slot>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'Loader',

	props: {
		show: { type: Boolean, default: false },
		infinite: { type: Boolean, default: false }
	}
}
</script>
