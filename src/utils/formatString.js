const linkify = require('linkifyjs')
import linkifyHtml from 'linkifyjs/html'

export default (text, doLinkify = false) => {
	const strings = text.split(' ')

	const formattedStrings = strings.map((string, i) => {
		const links = linkify.find(string)

		let result = ''

		if (doLinkify && links.length && string === links[0].value) {
			result = {
				bind: true,
				content: linkifyHtml(links[0].value, {
					defaultProtocol: 'https'
				})
			}
		} else {
			if (string.length > 2) {
				const formats = []

				string = testString(string, '*', 'b', formats)
				string = testString(string, '_', 'i', formats)

				string = testString(string, '*', 'b', formats)
				string = testString(string, '~', 'del', formats)

				string = testString(string, '*', 'b', formats)
				string = testString(string, '_', 'i', formats)
				string = testString(string, '|', 'ins', formats)

				string = testString(string, '*', 'b', formats)
				string = testString(string, '_', 'i', formats)
				string = testString(string, '~', 'del', formats)

				formats.map(format => {
					string = `<${format}>${string}</${format}>`
				})

				result = { bind: formats.length, content: string }
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

function testString(string, sign, type, formats) {
	if (string.slice(0, 1) === sign && string.slice(-1) === sign) {
		string = string.slice(1, -1)
		formats.push(type)
	}

	return string
}
