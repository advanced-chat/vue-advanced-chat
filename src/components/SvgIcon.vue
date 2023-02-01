<template>
	<svg
		:class="svgClass"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		version="1.1"
		width="24"
		height="24"
		:viewBox="`0 0 ${size} ${size}`"
	>
		<path :id="svgId" :d="svgItem[name].path" :stroke="stroke" strokeWidth="{1}" />
		<path v-if="svgItem[name].path2" :id="svgId" :d="svgItem[name].path2" />
	</svg>
</template>

<script>
export default {
	name: 'SvgIcon',

	props: {
		name: { type: String, default: null },
		param: { type: String, default: null }
	},

	data() {
		return {
			svgItem: {
				search: {
					path:
						'M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z'
				},
				add: {
					path:
						'M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'
				},
				toggle: {
					size: 'custom',
					path:
						'M8.32026 16.4795L1.01296 9.31186C0.613297 8.91984 0.613295 8.2761 1.01296 7.88407L8.32026 0.716373'
				},

				menu: {
					path:
						'M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z'
				},
				close: {
					path:
						'M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z'
				},
				file: {
					path:
						'M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z'
				},
				paperclip: {
					size: 'custom',
					path:
						'M12.9926 5.11493L5.56802 12.5395C3.81066 14.2969 3.81066 17.1461 5.56802 18.9035C7.32537 20.6608 10.1746 20.6608 11.932 18.9035L20.7708 10.0647C21.9424 8.8931 21.9424 6.9936 20.7708 5.82205C19.5992 4.65046 17.6997 4.65046 16.5282 5.82205L7.68932 14.6608C7.10357 15.2466 7.10357 16.1964 7.68932 16.7822C8.27512 17.368 9.22488 17.368 9.81068 16.7822L17.2353 9.35755'
				},
				'close-outline': {
					path:
						'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'
				},
				send: {
					size: 'custom',
					path: 'M15.9883 2.94824L2.00238 10.5406L9.59473 11.3398L13.5928 18.1329L15.9883 2.94824Z',
					path2: 'M9.67969 11.5647L15.4464 3.70117'
				},
				emoji: {
					path:
						'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z'
				},
				document: {
					path: 'M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z'
				},
				pencil: {
					path:
						'M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z'
				},
				checkmark: {
					path: 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z'
				},
				'double-checkmark': {
					path:
						'M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z'
				},
				eye: {
					path:
						'M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z'
				},
				dropdown: {
					path: 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z'
				},
				deleted: {
					path:
						'M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,13.85 4.63,15.55 5.68,16.91L16.91,5.68C15.55,4.63 13.85,4 12,4M12,20A8,8 0 0,0 20,12C20,10.15 19.37,8.45 18.32,7.09L7.09,18.32C8.45,19.37 10.15,20 12,20Z'
				},
				microphone: {
					size: 'large',
					path:
						'M432.8,216.4v39.2c0,45.2-15.3,84.3-45.2,118.4c-29.8,33.2-67.3,52.8-111.6,57.9v40.9h78.4c5.1,0,10.2,1.7,13.6,6c4.3,4.3,6,8.5,6,13.6c0,5.1-1.7,10.2-6,13.6c-4.3,4.3-8.5,6-13.6,6H157.6c-5.1,0-10.2-1.7-13.6-6c-4.3-4.3-6-8.5-6-13.6c0-5.1,1.7-10.2,6-13.6c4.3-4.3,8.5-6,13.6-6H236v-40.9c-44.3-5.1-81.8-23.9-111.6-57.9s-45.2-73.3-45.2-118.4v-39.2c0-5.1,1.7-10.2,6-13.6c4.3-4.3,8.5-6,13.6-6s10.2,1.7,13.6,6c4.3,4.3,6,8.5,6,13.6v39.2c0,37.5,13.6,70.7,40,97.1s59.6,40,97.1,40s70.7-13.6,97.1-40c26.4-26.4,40-59.6,40-97.1v-39.2c0-5.1,1.7-10.2,6-13.6c4.3-4.3,8.5-6,13.6-6c5.1,0,10.2,1.7,13.6,6C430.2,206.2,432.8,211.3,432.8,216.4z M353.5,98v157.6c0,27.3-9.4,50.3-29,69c-19.6,19.6-42.6,29-69,29s-50.3-9.4-69-29c-19.6-19.6-29-42.6-29-69V98c0-27.3,9.4-50.3,29-69c19.6-19.6,42.6-29,69-29s50.3,9.4,69,29C344.2,47.7,353.5,71.6,353.5,98z'
				},
				'audio-play': {
					size: 'medium',
					path:
						'M43.331,21.237L7.233,0.397c-0.917-0.529-2.044-0.529-2.96,0c-0.916,0.528-1.48,1.505-1.48,2.563v41.684   c0,1.058,0.564,2.035,1.48,2.563c0.458,0.268,0.969,0.397,1.48,0.397c0.511,0,1.022-0.133,1.48-0.397l36.098-20.84   c0.918-0.529,1.479-1.506,1.479-2.564S44.247,21.767,43.331,21.237z'
				},
				'audio-pause': {
					size: 'medium',
					path:
						'M17.991,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631C4.729,2.969,7.698,0,11.36,0l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z',
					path2:
						'M42.877,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631C29.616,2.969,32.585,0,36.246,0l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z'
				}
			}
		}
	},

	computed: {
		svgId() {
			const param = this.param ? '-' + this.param : ''
			return `vac-icon-${this.name}${param}`
		},
		svgClass() {
			const param = this.param ? '-' + this.param : ''
			return `${this.name}${param}-styles`
		},
		size() {
			const item = this.svgItem[this.name]

			if (item.size === 'large') return 512
			else if (item.size === 'medium') return 48
			else if (item.size === 'custom') return 22
			else return 24
		},
		stroke() {
			return this.name === 'close' ? 'black' : null
		}
	}
}
</script>

<style lang="scss">

.menu-styles {
	background: #FFFFFF;
	box-shadow: 0px 9px 10px rgba(39, 32, 48, 0.06);
	border-radius: 50px;
	padding: 5px;
}

#vac-icon-search {
	fill: var(--chat-icon-color-search);
}

#vac-icon-add {
	fill: var(--chat-icon-color-add);
}

#vac-icon-toggle {
	stroke: var(--chat-icon-color-toggle);
	fill: var(--chat-message-bg-color-me);
}

#vac-icon-menu {
	fill: var(--chat-icon-color-menu);
}

#vac-icon-close {
	fill: var(--chat-icon-color-close);
}

#vac-icon-close-image {
	fill: var(--chat-icon-color-close-image);
}

#vac-icon-file {
	fill: var(--chat-icon-color-file);
}

#vac-icon-paperclip {
	stroke:#473068;
	fill: none;
}

#vac-icon-close-outline {
	fill: var(--chat-icon-color-close-outline);
}

#vac-icon-send {
	stroke: var(--chat-icon-color-send);
	fill: none;
}

.send-styles {
	background-color: var(--chat-icon-color-add);
	border-radius:50px;
	padding: 5px;
	margin-left: 12px !important;
	border: 1px solid var(--chat-icon-color-add);
	width: 28px;
	height: 28px;
}

#vac-icon-send-disabled {
	stroke: var(--chat-icon-color-send-disabled);
    fill: var(--chat-message-bg-color-me);
}

.send-disabled-styles {
	background-color: var(--chat-message-bg-color-me);
	border-radius:50px;
	padding: 5px;
	margin-left: 12px !important;
	border: 1px solid var(--chat-icon-color-send-disabled);
	width: 28px;
	height: 28px;
}

#vac-icon-emoji {
	fill: var(--chat-icon-color-emoji);
}

#vac-icon-emoji-reaction {
	fill: var(--chat-icon-color-emoji-reaction);
}

#vac-icon-document {
	fill: var(--chat-icon-color-document);
}

#vac-icon-pencil {
	fill: var(--chat-icon-color-pencil);
}

#vac-icon-checkmark,
#vac-icon-double-checkmark {
	fill: var(--chat-icon-color-checkmark);
}

#vac-icon-checkmark-seen,
#vac-icon-double-checkmark-seen {
	fill: var(--chat-icon-color-checkmark-seen);
}

#vac-icon-eye {
	fill: var(--chat-icon-color-eye);
}

#vac-icon-dropdown-message {
	fill: var(--chat-icon-color-dropdown-message);
}

#vac-icon-dropdown-room {
	fill: var(--chat-icon-color-dropdown-room);
}

#vac-icon-dropdown-scroll {
	fill: var(--chat-icon-color-dropdown-scroll);
}

#vac-icon-audio-play {
	fill: var(--chat-icon-color-audio-play);
}

#vac-icon-audio-pause {
	fill: var(--chat-icon-color-audio-pause);
}
</style>
