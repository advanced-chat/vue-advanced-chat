export default (items, prop, val, startsWith = false) => {
	if (!val || val === '') return items

	/**
	 * If prop is an array, it will search for the value
	 * in all the fields, e.g. prop = ['roomName', 'email']
	 */
	if (Array.isArray(prop)) {
		return items.filter(item => {
			if (startsWith) {
				return prop.some(searchField => formatString(item[searchField]).startsWith(formatString(val)))
			}
			return prop.some(searchField => formatString(item[searchField]).includes(formatString(val)))
		})
	}

	return items.filter(item => {
		if (startsWith) return formatString(item[prop]).startsWith(formatString(val))
		return formatString(item[prop]).includes(formatString(val))
	})
}

function formatString(string) {
	return string
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.trim()
}
