export default (items, prop, val, startsWith = false) => {
	if (!val || val === '') return items

	return items.filter(v => {
		if (startsWith) return formatString(v[prop]).startsWith(formatString(val))
		return formatString(v[prop]).includes(formatString(val))
	})
}

export function filterMultipleItems(
	items,
	props = ['roomName'],
	val,
	startsWith = false
) {
	if (!val || val === '') return items

	return items.filter(v => {
		return props.some(prop => {
			if (typeof v[prop] === 'string') {
				if (startsWith)
					return formatString(v[prop]).startsWith(formatString(val))
				return formatString(v[prop]).includes(formatString(val))
			} else if (typeof v[prop] === 'number') {
				return String(v[prop]).startsWith(formatString(val))
			} else {
				return v[prop] === val
			}
		})
	})
}

function formatString(string) {
	return string
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
}
