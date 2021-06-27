<template>
	<transition name="vac-slide-up">
		<div
			v-if="filteredUsersTag.length"
			class="vac-tags-container vac-app-box-shadow"
			:style="{ bottom: `${$parent.$refs.roomFooter.clientHeight}px` }"
		>
			<div
				v-for="user in filteredUsersTag"
				:key="user._id"
				class="vac-tags-box"
				@click="$emit('select-user-tag', user)"
			>
				<div class="vac-tags-info">
					<div
						v-if="user.avatar"
						class="vac-avatar vac-tags-avatar"
						:style="{ 'background-image': `url('${user.avatar}')` }"
					/>
					<div class="vac-tags-username">
						{{ user.username }}
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'RoomUsersTag',

	props: {
		filteredUsersTag: { type: Array, required: true }
	}
}
</script>
