const linkify = require('linkifyjs')

export default (text, doLinkify = false) => {
	const j = compileToJSON(text)

	const h = compileToHTML(j)

	const f = flattenResult(h)

	const r = [].concat.apply([], f)

	return r
}

const pseudo_markdown = {
	'*': {
		end: '\\*',
		allowed_chars: '.',
		type: 'bold'
	},
	_: {
		end: '_',
		allowed_chars: '.',
		type: 'italic'
	},
	'~': {
		end: '~',
		allowed_chars: '.',
		type: 'strike'
	},
	'°': {
		end: '°',
		allowed_chars: '.',
		type: 'underline'
	},
	'```': {
		end: '```',
		allowed_chars: '(.|\n)',
		object: child => `<div class="multiline-code">${child}</div>`
	},
	'`': {
		end: '`',
		allowed_chars: '.',
		object: child => `<div class="inline-code">${child}</div>`
	}
	// '°': {
	// 	end: '°',
	// 	allowed_chars: '.',
	// 	object: child => `<div class="italic">${child}</div>`
	// },
	// '>>>': {
	// 	end: false,
	// 	allowed_chars: '(.|\n)',
	// 	object: child => `<div class="italic">${child}</div>`
	// },
	// '>': {
	// 	end: '$',
	// 	object: child => `<div class="italic">${child}</div>`
	// }
	// ':': {
	// 	allowed_chars: '[a-z_]',
	// 	end: ':',
	// 	object: child => <Emojione type={child[0]} />
	// },
	// '@': {
	// 	allowed_chars: '[a-z_.-A-Z0-9]',
	// 	end: ' ',
	// 	object: child => <User data={child} />
	// }
}

function compileToJSON(str) {
	let result = []
	let min_index_of = -1
	let min_index_of_key = null

	Object.keys(pseudo_markdown).forEach(starting_value => {
		const io = str.indexOf(starting_value)
		if (io >= 0 && (min_index_of < 0 || io < min_index_of)) {
			min_index_of = io
			min_index_of_key = starting_value
		}
	})

	if (min_index_of_key) {
		let str_left = str.substr(0, min_index_of)
		const char = min_index_of_key
		let str_right = str.substr(min_index_of + char.length)

		const match = str_right.match(
			new RegExp(
				'^(' +
					(pseudo_markdown[char].allowed_chars || '.') +
					'*' +
					(pseudo_markdown[char].end ? '?' : '') +
					')' +
					(pseudo_markdown[char].end
						? '(' + pseudo_markdown[char].end + ')'
						: ''),
				'm'
			)
		)
		if (!match) {
			str_left = str_left + char
			result.push(str_left)
		} else {
			if (str_left) {
				result.push(str_left)
			}
			const object = {
				start: char,
				content: compileToJSON(match[1]),
				end: match[2],
				type: pseudo_markdown[char].type
			}
			result.push(object)
			str_right = str_right.substr(match[0].length)
		}
		result = result.concat(compileToJSON(str_right))
		return result
	} else {
		if (str) {
			return [str]
		} else {
			return []
		}
	}
}

function compileToHTML(json) {
	const result = []

	json.forEach(item => {
		if (typeof item == 'string') {
			result.push({ types: [], value: item })
		} else {
			if (pseudo_markdown[item.start]) {
				result.push(parseContent(item))
			}
		}
	})

	return result
}

function parseContent(item) {
	const result = []

	item.content.forEach(it => {
		if (typeof it == 'string') {
			result.push({
				types: [item.type],
				value: it
			})
		} else {
			it.content.forEach(i => {
				if (typeof i == 'string') {
					result.push({
						types: [it.type].concat([item.type]),
						value: i
					})
				} else {
					result.push({
						types: [i.type].concat([it.type]).concat([item.type]),
						value: parseContent(i)
					})
				}
			})
		}
	})

	return result
}

function flattenResult(array, types = []) {
	const result = []

	array.forEach(arr => {
		if (typeof arr.value == 'string') {
			arr.types = arr.types.concat(types)
			result.push(arr)
		} else {
			arr.forEach(a => {
				if (typeof a.value == 'string') {
					a.types = a.types.concat(types)
					result.push(a)
				} else {
					result.push(flattenResult(a.value, a.types))
				}
			})
		}
	})

	return result
}
