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
							top: `${emojiPickerHeight}px`,
							right: positionRight ? '85px' : '',
							display: emojiPickerHeight || !emojiReaction ? 'initial' : 'none'
						}"
					>
						<div class="emoji-picker__search">
							<input type="text" v-model="search" v-focus />
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
	props: ['emojiOpened', 'emojiReaction', 'roomFooterRef', 'positionRight'],
	data() {
		return {
			search: '',
			emojiPickerHeight: ''
		}
	},
	methods: {
		append({ emoji, emojiName }) {
			this.$emit('addEmoji', { icon: emoji, name: emojiName })
		},
		openEmoji(ev) {
			this.$emit('openEmoji', true)
			this.setEmojiPickerHeight(ev.clientY)
		},
		setEmojiPickerHeight(clientY) {
			setTimeout(() => {
				if (!this.roomFooterRef) return

				const roomFooterTop = this.roomFooterRef.getBoundingClientRect().top
				const pickerTopPosition = roomFooterTop - clientY > 320

				if (pickerTopPosition) this.emojiPickerHeight = clientY
				else this.emojiPickerHeight = clientY - 320
			}, 0)
		}
	},
	directives: {
		focus: {
			inserted(el) {
				el.focus()
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.wrapper {
	position: relative;
	display: flex;
}

.regular-input {
	padding: 0.5rem 1rem;
	border-radius: 3px;
	border: var(--chat-border-style);
	width: 20rem;
	height: 12rem;
	outline: none;
}

.emoji-picker {
	position: absolute;
	z-index: 9999;
	bottom: 32px;
	right: 10px;
	border: var(--chat-border-style);
	width: 15rem;
	height: 20rem;
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
	margin-bottom: 0;
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
