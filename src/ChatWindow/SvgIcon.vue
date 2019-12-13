<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		version="1.1"
		width="24"
		height="24"
		viewBox="0 0 24 24"
	>
		<path :id="svgId" :d="svgItem.find(item => item.name === name).path" />
	</svg>
</template>

<script>
export default {
	props: ['name', 'path', 'param'],

	computed: {
		svgId() {
			const param = this.param ? '-' + this.param : ''
			return `chat-icon-${this.name}${param}`
		}
	},

	data() {
		return {
			svgItem: [
				{
					name: 'search',
					path:
						'M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z'
				},
				{
					name: 'add',
					path:
						'M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'
				},
				{
					name: 'menu',
					path:
						'M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z'
				},
				{
					name: 'close',
					path:
						'M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z'
				},
				{
					name: 'file',
					path:
						'M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z'
				},
				{
					name: 'paperclip',
					path:
						'M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z'
				},
				{
					name: 'close-outline',
					path:
						'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'
				},
				{
					name: 'send',
					path: 'M2,21L23,12L2,3V10L17,12L2,14V21Z'
				},
				{
					name: 'emoji',
					path:
						'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z'
				},
				{
					name: 'document',
					path: 'M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z'
				},
				{
					name: 'pencil',
					path:
						'M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z'
				},
				{
					name: 'trash',
					path:
						'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z'
				},
				{
					name: 'checkmark',
					path: 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z'
				}
			]
		}
	}
}
</script>

<style>
#chat-icon-search {
	fill: var(--chat-icon-color-search);
}

#chat-icon-add {
	fill: var(--chat-icon-color-add);
}

#chat-icon-menu {
	fill: var(--chat-icon-color-menu);
}

#chat-icon-close {
	fill: var(--chat-icon-color-close);
}

#chat-icon-close-image {
	fill: var(--chat-icon-color-close-image);
}

#chat-icon-file {
	fill: var(--chat-icon-color-file);
}

#chat-icon-paperclip {
	fill: var(--chat-icon-color-paperclip);
}

#chat-icon-close-outline {
	fill: var(--chat-icon-color-close-outline);
}

#chat-icon-send {
	fill: var(--chat-icon-color-send);
}

#chat-icon-send-disabled {
	fill: var(--chat-icon-color-send-disabled);
}

#chat-icon-emoji {
	fill: var(--chat-icon-color-emoji);
}

#chat-icon-document {
	fill: var(--chat-icon-color-document);
}

#chat-icon-pencil {
	fill: var(--chat-icon-color-pencil);
}

#chat-icon-pencil-edited {
	fill: var(--chat-edited-icon-color-pencil);
}

#chat-icon-trash {
	fill: var(--chat-icon-color-trash);
}

#chat-icon-checkmark {
	fill: var(--chat-icon-color-checkmark);
}
</style>
