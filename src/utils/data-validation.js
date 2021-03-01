export function roomsValidation(obj) {
	const roomsValidate = [
		{ key: 'roomId', type: ['string', 'number'] },
		{ key: 'roomName', type: ['string'] },
		{ key: 'users', type: ['array'] }
	]

	const validate = (obj, props) => {
		return props.every(prop => {
			let validType = false

			if (prop.type[0] === 'array' && Array.isArray(obj[prop.key])) {
				validType = true
			} else if (prop.type.find(t => t === typeof obj[prop.key])) {
				validType = true
			}

			return validType && checkObjectValid(obj, prop.key)
		})
	}

	if (!validate(obj, roomsValidate)) {
		throw new Error(
			'Rooms object is not valid! Must contain roomId[String, Number], roomName[String] and users[Array]'
		)
	}
}

export function partcipantsValidation(obj) {
	const participantsValidate = [
		{ key: '_id', type: ['string', 'number'] },
		{ key: 'username', type: ['string'] }
	]

	const validate = (obj, props) => {
		return props.every(prop => {
			const validType = prop.type.find(t => t === typeof obj[prop.key])
			return validType && checkObjectValid(obj, prop.key)
		})
	}

	if (!validate(obj, participantsValidate)) {
		throw new Error(
			'Participants object is not valid! Must contain _id[String, Number] and username[String]'
		)
	}
}

export function messagesValidation(obj) {
	const messagesValidate = [
		{ key: '_id', type: ['string', 'number'] },
		{ key: 'content', type: ['string', 'number'] },
		{ key: 'senderId', type: ['string', 'number'] }
	]

	const validate = (obj, props) => {
		return props.every(prop => {
			const validType = prop.type.find(t => t === typeof obj[prop.key])
			return validType && checkObjectValid(obj, prop.key)
		})
	}

	if (!validate(obj, messagesValidate)) {
		throw new Error(
			'Messages object is not valid! Must contain _id[String, Number], content[String, Number] and senderId[String, Number]'
		)
	}
}

function checkObjectValid(obj, key) {
	return (
		Object.prototype.hasOwnProperty.call(obj, key) &&
		obj[key] !== null &&
		obj[key] !== undefined
	)
}
