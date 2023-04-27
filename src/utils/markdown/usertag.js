const usertagTokenize = (effects, ok, nok) => {
	const inside = code => {
		if (code === -5 || code === -4 || code === -3 || code === null) {
			return nok(code)
		}

		if (code === 92) {
			effects.consume(code)

			return insideEscape
		}

		if (code === 62) {
			effects.exit('usertagString')
			effects.enter('usertagMarker')
			effects.consume(code)
			effects.exit('usertagMarker')
			effects.exit('usertag')

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

	const begin = code => {
		if (code === 64) {
			effects.consume(code)

			return inside(code)
		}

		return nok(code)
	}

	return code => {
		effects.enter('usertag')
		effects.enter('usertagMarker')
		effects.consume(code)
		effects.exit('usertagMarker')
		effects.enter('usertagString')

		return begin
	}
}

const usertagConstruct = { name: 'usertag', tokenize: usertagTokenize }

export const usertag = { text: { 60: usertagConstruct } }

export const usertagHtml = users => ({
	enter: {
		usertag(token) {
			this.tag('<span class="vac-text-tag">')

			const tag = this.sliceSerialize(token)
			const userId = tag.substring(2, tag.length - 1)
			const user = users.find(user => user._id === userId)

			this.raw(this.encode(user.username))
		}
	},
	exit: {
		usertag() {
			this.tag('</span>')
		}
	}
})
