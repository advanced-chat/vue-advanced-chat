const underlineTokenize = (effects, ok, nok) => {
	const inside = code => {
		if (code === -5 || code === -4 || code === -3 || code === null) {
			return nok(code)
		}

		if (code === 92) {
			effects.consume(code)

			return insideEscape
		}

		if (code === 176) {
			effects.exit('chunkString')
			effects.exit('underlineString')
			effects.enter('underlineMarker')
			effects.consume(code)
			effects.exit('underlineMarker')
			effects.exit('underline')

			return ok
		}

		effects.consume(code)

		return inside
	}

	const insideEscape = code => {
		if (code === 92 || code === 125) {
			effects.consume(code)

			return inside
		}

		return inside(code)
	}

	const begin = code => (code === 176 ? nok(code) : inside(code))

	return code => {
		effects.enter('underline')
		effects.enter('underlineMarker')
		effects.consume(code)
		effects.exit('underlineMarker')
		effects.enter('underlineString')
		effects.enter('chunkString', { contentType: 'string' })

		return begin
	}
}

const underlineConstruct = { name: 'underline', tokenize: underlineTokenize }

export const underline = { text: { 176: underlineConstruct } }

export const underlineHtml = {
	enter: {
		underline() {
			this.tag('<u>')
		}
	},
	exit: {
		underline() {
			this.tag('</u>')
		}
	}
}
