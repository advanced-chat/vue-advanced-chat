<template>
	<div>
		<div class="app-container">
			<span class="user-logged">Logged as</span>
			<select v-model="currentUserId">
				<option v-for="user in users" :key="user._id" :value="user._id">{{
					user.username
				}}</option>
			</select>
			<chat-container :currentUserId="currentUserId" v-if="showChat"/>
		</div>
	</div>
</template>

<script>
import { usersRef } from '@/firestore'
import ChatContainer from '../../src/ChatWindow/ChatContainer'
export default {
	components: {
		ChatContainer
	},

	data() {
		return {
			showChat: true,
			users: [],
			currentUserId: '6R0MijpK6M4AIrwaaCY2',
			updatingData: false
		}
	},
	async created() {
		const userSnapshot = await usersRef.get()
		const users = userSnapshot.empty
			? []
			: userSnapshot.docs.map(doc => doc.data())
		this.users = users
	},

	watch: {
		currentUserId() {
			this.showChat = false
			setTimeout(() => (this.showChat = true), 150)
		}
	}
}
</script>

<style lang="scss">
body {
	background: #fafafa;
	margin:0;
	padding:0;
}

.app-container {
	font-family: 'Roboto', sans-serif;
	padding: 10px 20px 20px;

	@media only screen and (max-width: 768px) {
		padding: 0;
	}
}

select {
	height: 20px;
	outline: none;
	border: 1px solid #e0e2e4;
	background: #fff;
}

.user-logged {
	font-size: 12px;
	margin-right: 5px;
}

.button-theme {
	float: right;

	.button-light {
		background: #fff;
		border: 1px solid #46484e;
		color: #46484e;
	}

	.button-dark {
		background: #1c1d21;
		border: 1px solid #1c1d21;
	}

	button {
		color: #fff;
		outline: none;
		cursor: pointer;
		border-radius: 4px;
		padding: 6px 12px;
		margin-left: 10px;
		border: none;
		font-size: 14px;
		transition: 0.3s;
		vertical-align: middle;

		&:hover {
			opacity: 0.8;
		}

		&:active {
			opacity: 0.6;
		}

		@media only screen and (max-width: 768px) {
			padding: 3px 6px;
			font-size: 13px;
		}
	}
}

.version-container {
	padding-top: 20px;
	text-align: right;
	font-size: 14px;
	color: grey;
}
</style>
