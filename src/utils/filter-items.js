export default (items, prop, val, startsWith = false) => {
	if (!val || val === '') return items

	/**
	 * If prop is an array, it will search for the value
	 * in all the fields, e.g. prop = ['roomName', 'email']
	 */
	if (Array.isArray(prop)) {
		return items.filter(v => {
			if (startsWith) {
				return prop.reduce((acc, searchField) => {
					return acc || formatString(v[searchField]).startsWith(formatString(val))
				}, false);
			}
			return prop.reduce((acc, searchField) => {
				return acc || formatString(v[searchField]).includes(formatString(val))
			}, false);
		})
	}

	return items.filter(v => {
		if (startsWith) return formatString(v[prop]).startsWith(formatString(val))
		return formatString(v[prop]).includes(formatString(val))
	})
}

function formatString(string) {
	return string
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.trim()
}
