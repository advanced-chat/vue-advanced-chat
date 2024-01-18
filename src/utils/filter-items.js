export default (items, prop, val, startsWith = false) => {
	if (!val || val === '') return items

	return items.filter(v => {
		if (startsWith) return formatString(v[prop]).startsWith(formatString(val))
		return formatString(v[prop]).includes(formatString(val))
	})
}

export function filterMultipleItems(items, props = ['roomName'], val, startsWith = false) {
	if (!val || val === '') return items

	let result = []

	for (let i = 0; i < props.length; i++) {
		const prop = props[i]
		result = [
			...result,
			items.filter(v => {
				if (startsWith) return formatString(v[prop]).startsWith(formatString(val))
				if (typeof v[prop] === 'string') {
					return formatString(v[prop]).includes(formatString(val))
				} else if (typeof v[prop] === 'number') {
					return v[prop] === Number(val)
				} else {
					return v[prop] === val
				}
			})
		]
	}

	return result
}

function formatString(string) {
	return string
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
}
