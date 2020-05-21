const linkify = require('linkifyjs')

export default (text, doLinkify = false) => {
	// text = testString(text, '*', 'b')
	// text = testString(text, '_', 'i')
	// text = testString(text, '~', 's')
	// text = testString(text, '|', 'u')

	// text = linkifyHtml(text, {
	// 	defaultProtocol: 'https'
	// })

	let splitStrings = testString(text, /(\*)/g, 'bold')

	const newStrings = []

	splitStrings = splitStrings.filter(s => s)

	splitStrings.forEach((string, i) => {
		const before = splitStrings[i - 1]
		const after = splitStrings[i + 1]
		if (before && before === '*' && after && after === '*') {
			newStrings.push({ type: 'bold', value: string })
			splitStrings.splice(i + 1, 1)
		} else if (string.length && string !== '*') {
			newStrings.push({ type: 'string', value: string })
		}
	})

	return newStrings

	// const strings = text.split(' ')

	// let formattedStrings = strings.map((string, i) => {
	// 	const links = linkify.find(string)

	// 	let result = ''

	// 	if (doLinkify && links.length && string === links[0].value) {
	// 		result = links[0]
	// 	} else {
	// 		result = {
	// 			value: string,
	// 			bind: ['<b>', '<i>', '<del>', '<ins>'].some(el => string.includes(el))
	// 		}
	// 	}

	// 	const space = i !== strings.length - 1 ? ' ' : ''
	// 	result.value = result.value + space

	// 	return result
	// })
}

function testString(string, regex) {
	const s = string.split(regex)

	return s
}
