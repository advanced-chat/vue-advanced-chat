const linkify = require('linkifyjs')

export default (text, doLinkify = false) => {
	const j = compileToJSON(text)

	console.log(j);

	const h = compileToHTML(j)

	console.log(h)

	return h
}

const pseudo_markdown = {
	'*': {
		end: '\\*',
		allowed_chars: '.',
		object: child => `<b>${child}</b>`
	},
	_: {
		end: '_',
		allowed_chars: '.',
		object: child => `<i>${child}</i>`
	},
	'~': {
		end: '~',
		allowed_chars: '.',
		object: child => `<s>${child}</s>`
	},
	'|': {
		end: '|',
		allowed_chars: '.',
		object: child => `<u>${child}</u>`
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
				end: match[2]
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
			result.push(item)
		} else {
			if (pseudo_markdown[item.start]) {
				result.push(
					pseudo_markdown[item.start].object(compileToHTML(item.content))
				)
			}
		}
	})
	return result
}
