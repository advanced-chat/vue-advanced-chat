<template>
	<transition name="vac-fade-spinner" appear>
		<div ref="progress" class="vac-progress-wrapper">
			<svg :height="radius * 2" :width="radius * 2">
				<circle
					stroke="rgba(255, 255, 255, 0.7)"
					:stroke-dasharray="circumference + ' ' + circumference"
					:style="{
						strokeDashoffset: strokeDashoffset,
						strokeLinecap: 'round'
					}"
					:stroke-width="stroke"
					fill="transparent"
					:r="normalizedRadius"
					:cx="radius"
					:cy="radius"
				/>
			</svg>
			<div
				class="vac-progress-content"
				:style="{
					height: radius * 2 - 19 + 'px',
					width: radius * 2 - 19 + 'px'
				}"
			>
				<div class="vac-progress-text">
					{{ progress }}<span class="vac-progress-pourcent">%</span>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'ProgressBar',

	props: {
		progress: { type: Number, default: 0 }
	},

	data() {
		const radius = 35
		const stroke = 4
		const normalizedRadius = radius - stroke * 2
		const circumference = normalizedRadius * 2 * Math.PI

		return {
			radius,
			stroke,
			normalizedRadius,
			circumference
		}
	},
	computed: {
		strokeDashoffset() {
			return this.circumference - (this.progress / 100) * this.circumference
		}
	}
}
</script>
