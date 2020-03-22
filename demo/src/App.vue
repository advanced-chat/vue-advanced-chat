<template>
	<div>
		<div class="app-container">
			<!-- <div>
				<button @click="resetData">Clear Data</button>
				<button @click="addData" :disabled="updatingData">Add Data</button>
			</div> -->
			<span class="user-logged">Logged as</span>
			<select v-model="currentUserId">
				<option v-for="user in users" :key="user._id" :value="user._id">
					{{ user.username }}
				</option>
			</select>

			<div class="button-theme">
				<button @click="theme = 'light'" class="button-light">Light</button>
				<button @click="theme = 'dark'" class="button-dark">Dark</button>
			</div>

			<chat-container
				:currentUserId="currentUserId"
				:theme="theme"
				v-if="showChat"
			/>

			<!-- <div class="version-container">
				v1.0.0
			</div> -->
		</div>
	</div>
</template>

<script>
import { roomsRef, usersRef } from '@/firestore'
import ChatContainer from './ChatContainer'

export default {
	components: {
		ChatContainer
	},

	data() {
		return {
			theme: 'light',
			showChat: true,
			users: [
				{
					_id: '6R0MijpK6M4AIrwaaCY2',
					username: 'Luke',
					avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj'
				},
				{
					_id: 'SGmFnBZB4xxMv9V4CVlW',
					username: 'Leia',
					avatar: 'https://avatarfiles.alphacoders.com/184/thumb-184913.jpg'
				},
				{
					_id: '6jMsIXUrBHBj7o2cRlau',
					username: 'Yoda',
					avatar:
						'https://vignette.wikia.nocookie.net/teamavatarone/images/4/45/Yoda.jpg/revision/latest?cb=20130224160049'
				}
			],
			currentUserId: '6R0MijpK6M4AIrwaaCY2',
			updatingData: false
		}
	},

	watch: {
		currentUserId() {
			this.showChat = false
			setTimeout(() => (this.showChat = true), 150)
		}
	},

	methods: {
		resetData() {
			roomsRef.get().then(val => {
				val.forEach(async val => {
					const ref = roomsRef.doc(val.id).collection('messages')

					await ref.get().then(res => {
						if (res.empty) return
						res.docs.map(doc => ref.doc(doc.id).delete())
					})

					roomsRef.doc(val.id).delete()
				})
			})

			usersRef.get().then(val => {
				val.forEach(val => {
					usersRef.doc(val.id).delete()
				})
			})
		},
		async addData() {
			this.updatingData = true

			const user1 = this.users[0]
			await usersRef.doc(user1._id).set(user1)

			const user2 = this.users[1]
			await usersRef.doc(user2._id).set(user2)

			const user3 = this.users[2]
			await usersRef.doc(user3._id).set(user3)

			await roomsRef.add({ users: [user1._id, user2._id] })
			await roomsRef.add({ users: [user1._id, user3._id] })
			await roomsRef.add({ users: [user2._id, user3._id] })
			await roomsRef.add({ users: [user1._id, user2._id, user3._id] })

			this.updatingData = false
		}
	}
}
</script>

<style lang="scss">
body {
	background: #fafafa;
}

.app-container {
	font-family: 'Quicksand', sans-serif;
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
