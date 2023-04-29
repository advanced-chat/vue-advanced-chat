import { codes } from './constants'

const usertagTokenize = (effects, ok, nok) => {
	const inside = code => {
		if (
			code === codes.carriageReturn ||
			code === codes.lineFeed ||
			code === codes.carriageReturnLineFeed ||
			code === codes.eof
		) {
			return nok(code)
		}

		if (code === codes.backslash) {
			effects.consume(code)

			return insideEscape
		}

		if (code === codes.greaterThan) {
			effects.exit('usertagContent')
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
		if (code === codes.backslash || code === codes.greaterThan) {
			effects.consume(code)

			return inside
		}

		return inside(code)
	}

	const begin = code => {
		if (code === codes.atSign) {
			effects.consume(code)
			effects.exit('usertagMarker')
			effects.enter('usertagContent')

			return inside
		}

		return nok(code)
	}

	return code => {
		effects.enter('usertag')
		effects.enter('usertagMarker')
		effects.consume(code)

		return begin
	}
}

const usertagConstruct = { name: 'usertag', tokenize: usertagTokenize }

export const usertag = { text: { 60: usertagConstruct } } // 60 is the less than sign

export const usertagHtml = users => ({
	exit: {
		usertagContent(token) {
			const userId = this.sliceSerialize(token)

			this.tag(`<span class="vac-text-tag" data-user-id="${userId}">`)

			const user = users.find(user => user._id === userId)

			this.raw(`@${this.encode(user ? user.username : userId)}`)

			this.tag('</span>')
		}
	}
})
