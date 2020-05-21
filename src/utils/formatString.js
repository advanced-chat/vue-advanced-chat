const linkify = require('linkifyjs')
import linkifyHtml from 'linkifyjs/html'

export default (text, doLinkify = false) => {
	text = testString(text, '*', 'b')
	text = testString(text, '_', 'i')
	text = testString(text, '~', 'del')
	text = testString(text, '|', 'ins')

	// text = linkifyHtml(text, {
	// 	defaultProtocol: 'https'
	// })

	// return text

	const strings = text.split(' ')

	let formattedStrings = strings.map((string, i) => {
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
			result = {
				content: string,
				bind: ['<b>', '<i>', '<del>', '<ins>'].some(el => string.includes(el))
			}
		}

		const space = i !== strings.length - 1 ? ' ' : ''
		result.content = result.content + space

		return result
	})

	// formattedStrings = formattedStrings.map((string, i) => {
	// 	if (
	// 		!string.bind &&
	// 		formattedStrings[i + 1] &&
	// 		!formattedStrings[i + 1].bind
	// 	) {
	// 		string.content = string.content + ' ' + formattedStrings[i + 1].content
	// 		formattedStrings.splice(i + 1, 1)
	// 	}

	// 	return string
	// })

	return formattedStrings
}

function testString(string, sign, type) {
	const indexes = getIndexes(string, sign)

	indexes.map((index, i) => {
		const even = i % 2 === 0
		const tag = even ? `<${type}>` : `</${type}>`

		let newIndex = index === 0 ? index : string.indexOf(sign)

		string = setCharAt(string, newIndex, tag)
	})

	return string
}

function setCharAt(str, index, chr) {
	if (index > str.length - 1) return str
	return str.substr(0, index) + chr + str.substr(index + 1)
}

function getIndexes(string, sign) {
	const indexes = []

	for (
		let pos = string.indexOf(sign);
		pos !== -1;
		pos = string.indexOf(sign, pos + 1)
	) {
		indexes.push(pos)
	}

	return indexes
}
