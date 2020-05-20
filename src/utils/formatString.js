const linkify = require('linkifyjs')
import linkifyHtml from 'linkifyjs/html'

export default text => {
	const strings = text.split(' ')

	const formattedStrings = strings.map((string, i) => {
		const links = linkify.find(string)

		let result = ''

		if (links.length && string === links[0].value) {
			result = {
				bind: true,
				content: linkifyHtml(links[0].value, {
					defaultProtocol: 'https'
				})
			}
		} else {
			const firstChar = string.slice(0, 1)
			const lastChar = string.slice(-1)

			if (string.length > 2 && firstChar === '*' && lastChar === '*') {
				result = { bind: true, content: `<b>${string.slice(1, -1)}</b>` }
			} else {
				result = { content: string }
			}
		}

		const space = i !== strings.length - 1 ? ' ' : ''
		result.content = result.content + space

		return result
	})

	return formattedStrings
}
