<template>
	<div class="wrapper">
		<emoji-picker @emoji="append" :search="search">
			<div
				class="svg-button"
				:class="{ 'button-reaction': emojiReaction }"
				slot="emoji-invoker"
				slot-scope="{ events: { click: clickEvent } }"
				@click.stop="clickEvent"
				@click="openEmoji"
			>
				<svg-icon name="emoji" :param="emojiReaction ? 'reaction' : ''" />
			</div>
			<div
				slot="emoji-picker"
				slot-scope="{ emojis, insert }"
				v-if="emojiOpened"
			>
				<transition name="slide-up" appear>
					<div
						class="emoji-picker"
						:class="{ 'picker-reaction': emojiReaction }"
						:style="{
							height: `${emojiPickerHeight}px`,
							top: positionTop ? emojiPickerHeight : `${emojiPickerTop}px`,
							right: emojiPickerRight,
							display: emojiPickerTop || !emojiReaction ? 'initial' : 'none'
						}"
					>
						<div class="emoji-picker__search">
							<input type="text" v-model="search" />
						</div>
						<div>
							<div v-for="(emojiGroup, category) in emojis" :key="category">
								<h5 v-if="category !== 'Frequently used'">{{ category }}</h5>
								<div class="emojis" v-if="category !== 'Frequently used'">
									<span
										v-for="(emoji, emojiName) in emojiGroup"
										:key="emojiName"
										@click="insert({ emoji, emojiName })"
										:title="emojiName"
									>
										{{ emoji }}
									</span>
								</div>
							</div>
						</div>
					</div>
				</transition>
			</div>
		</emoji-picker>
	</div>
</template>

<script>
import EmojiPicker from 'vue-emoji-picker'
import SvgIcon from './SvgIcon'

export default {
	components: {
		EmojiPicker,
		SvgIcon
	},
	props: [
		'emojiOpened',
		'emojiReaction',
		'roomFooterRef',
		'positionTop',
		'positionRight'
	],
	data() {
		return {
			search: '',
			emojiPickerHeight: 320,
			emojiPickerTop: 0,
			emojiPickerRight: ''
		}
	},
	methods: {
		append({ emoji, emojiName }) {
			this.$emit('addEmoji', { icon: emoji, name: emojiName })
		},
		openEmoji(ev) {
			this.$emit('openEmoji', true)
			this.setEmojiPickerPosition(
				ev.clientY,
				ev.view.innerWidth,
				ev.view.innerHeight
			)
		},
		setEmojiPickerPosition(clientY, innerWidth, innerHeight) {
			setTimeout(() => {
				if (!this.roomFooterRef) {
					if (innerWidth < 500) this.emojiPickerRight = '0px'
					return
				}

				if (innerHeight < 700) this.emojiPickerHeight = innerHeight / 2
				const roomFooterTop = this.roomFooterRef.getBoundingClientRect().top
				const pickerTopPosition =
					roomFooterTop - clientY > this.emojiPickerHeight - 50

				if (pickerTopPosition) this.emojiPickerTop = clientY + 10
				else this.emojiPickerTop = clientY - this.emojiPickerHeight - 10

				if (innerWidth < 500 && !this.positionRight) {
					this.emojiPickerRight = innerWidth / 5 + 'px'
				} else {
					this.emojiPickerRight = this.positionTop
						? '-50px'
						: this.positionRight
						? '60px'
						: ''
				}
			}, 0)
		}
	}
}
</script>

<style lang="scss" scoped>
.wrapper {
	position: relative;
	display: flex;
}

.emoji-picker {
	position: absolute;
	z-index: 9999;
	bottom: 32px;
	right: 10px;
	border: var(--chat-border-style);
	width: 240px;
	overflow: scroll;
	padding: 1rem;
	box-sizing: border-box;
	border-radius: 0.5rem;
	background: var(--chat-emoji-bg-color);
}

.picker-reaction {
	position: fixed;
	top: initial;
	right: initial;
}

.emoji-picker__search {
	display: flex;
}

.emoji-picker__search > input {
	flex: 1;
	border-radius: 10rem;
	border: var(--chat-border-style);
	padding: 0.5rem 1rem;
	outline: none;
	background: var(--chat-bg-color-input);
	color: var(--chat-color);
}

.emoji-picker h5 {
	margin: 20px 0 8px;
	color: #b1b1b1;
	text-transform: uppercase;
	font-size: 0.8rem;
	cursor: default;
}

.emoji-picker .emojis {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.emoji-picker .emojis:after {
	content: '';
	flex: auto;
}

.emoji-picker .emojis span {
	padding: 0.2rem;
	cursor: pointer;
	border-radius: 5px;
}

.emoji-picker .emojis span:hover {
	background: var(--chat-sidemenu-bg-color-hover);
	cursor: pointer;
}

.button-reaction svg {
	height: 19px;
	width: 19px;
}
</style>
