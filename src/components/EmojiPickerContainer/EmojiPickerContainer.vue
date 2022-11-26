<template>
	<div class="vac-emoji-wrapper">
		<div
			class="vac-svg-button"
			:class="{ 'vac-emoji-reaction': emojiReaction }"
			@click="openEmoji"
		>
			<slot
				:name="
					messageId
						? 'emoji-picker-reaction-icon_' + messageId
						: 'emoji-picker-icon'
				"
			>
				<svg-icon name="emoji" :param="emojiReaction ? 'reaction' : ''" />
			</slot>
		</div>

		<template v-if="emojiOpened">
			<transition name="vac-slide-up" appear>
				<div
					class="vac-emoji-picker"
					:class="{ 'vac-picker-reaction': emojiReaction }"
					:style="{
						height: `${emojiPickerHeight}px`,
						top: positionTop ? emojiPickerHeight : `${emojiPickerTop}px`,
						right: emojiPickerRight,
						display: emojiPickerTop || !emojiReaction ? 'initial' : 'none'
					}"
				>
					<emoji-picker
						v-if="emojiOpened"
						ref="emojiPicker"
						:data-source="emojiDataSource"
					/>
				</div>
			</transition>
		</template>
	</div>
</template>

<script>
import SvgIcon from '../SvgIcon/SvgIcon'
import { findParentBySelector } from '../../utils/element-selector'

export default {
	name: 'EmojiPickerContainer',
	components: {
		SvgIcon
	},

	props: {
		emojiOpened: { type: Boolean, default: false },
		emojiReaction: { type: Boolean, default: false },
		positionTop: { type: Boolean, default: false },
		positionRight: { type: Boolean, default: false },
		messageId: { type: String, default: '' },
		emojiDataSource: { type: String, default: undefined }
	},

	emits: ['add-emoji', 'open-emoji'],

	data() {
		return {
			emojiPickerHeight: 320,
			emojiPickerTop: 0,
			emojiPickerRight: ''
		}
	},

	watch: {
		emojiOpened(val) {
			if (val) {
				setTimeout(() => {
					this.addCustomStyling()

					this.$refs.emojiPicker.shadowRoot.addEventListener(
						'emoji-click',
						({ detail }) => {
							this.$emit('add-emoji', {
								unicode: detail.unicode
							})
						}
					)
				}, 0)
			}
		}
	},

	methods: {
		addCustomStyling() {
			const picker = `.picker {
				border: none;
			}`

			const nav = `.nav {
				overflow-x: auto;
			}`

			const searchBox = `.search-wrapper {
				padding-right: 2px;
				padding-left: 2px;
			}`

			const search = `input.search {
				height: 32px;
				font-size: 14px;
				border-radius: 10rem;
				border: var(--chat-border-style);
				padding: 5px 10px;
				outline: none;
				background: var(--chat-bg-color-input);
				color: var(--chat-color);
			}`

			const style = document.createElement('style')
			style.textContent = picker + nav + searchBox + search
			this.$refs.emojiPicker.shadowRoot.appendChild(style)
		},
		openEmoji(ev) {
			this.$emit('open-emoji', !this.emojiOpened)
			this.setEmojiPickerPosition(
				ev.clientY,
				ev.view.innerWidth,
				ev.view.innerHeight
			)
		},
		setEmojiPickerPosition(clientY, innerWidth, innerHeight) {
			const mobileSize = innerWidth < 500 || innerHeight < 700
			const roomFooterRef = findParentBySelector(this.$el, '#room-footer')

			if (!roomFooterRef) {
				if (mobileSize) this.emojiPickerRight = '-50px'
				return
			}

			if (mobileSize) {
				this.emojiPickerRight =
					innerWidth / 2 - (this.positionTop ? 200 : 150) + 'px'
				this.emojiPickerTop = 100
				this.emojiPickerHeight = innerHeight - 200
			} else {
				const roomFooterTop = roomFooterRef.getBoundingClientRect().top
				const pickerTopPosition =
					roomFooterTop - clientY > this.emojiPickerHeight - 50

				if (pickerTopPosition) this.emojiPickerTop = clientY + 10
				else this.emojiPickerTop = clientY - this.emojiPickerHeight - 10

				this.emojiPickerRight = this.positionTop
					? '0px'
					: this.positionRight
					? '60px'
					: ''
			}
		}
	}
}
</script>
