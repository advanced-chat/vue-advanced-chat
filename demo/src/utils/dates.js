export const parseTimestamp = (timestamp, format = '') => {
	if (!timestamp) return

	const date = timestamp.seconds
		? new Date(timestamp.seconds * 1000)
		: timestamp

	if (format === 'HH:mm') {
		return `${zeroPad(date.getHours(), 2)}:${zeroPad(date.getMinutes(), 2)}`
	} else if (format === 'DD MMMM YYYY') {
		const options = { month: 'long', year: 'numeric', day: 'numeric' }
		return `${new Intl.DateTimeFormat('en-GB', options).format(date)}`
	} else if (format === 'DD/MM/YY') {
		const options = { month: 'numeric', year: 'numeric', day: 'numeric' }
		return `${new Intl.DateTimeFormat('en-GB', options).format(date)}`
	} else if (format === 'DD MMMM, HH:mm') {
		const options = { month: 'long', day: 'numeric' }
		return `${new Intl.DateTimeFormat('en-GB', options).format(
			date
		)}, ${zeroPad(date.getHours(), 2)}:${zeroPad(date.getMinutes(), 2)}`
	}

	return date
}

const zeroPad = (num, pad) => {
	return String(num).padStart(pad, '0')
}

export const isSameDay = (d1, d2) => {
	return (
		d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate()
	)
}
