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
			<div id="vac-circle" />
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
