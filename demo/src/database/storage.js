import { storage } from '@/database'

import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytesResumable
} from 'firebase/storage'

const FILES_PATH = 'files'

const fileRef = (currentUserId, messageId, fileName) => {
	return ref(storage, `${FILES_PATH}/${currentUserId}/${messageId}/${fileName}`)
}

export const deleteFile = (currentUserId, messageId, file) => {
	return deleteObject(
		fileRef(
			currentUserId,
			messageId,
			`${file.name}.${file.extension || file.type}`
		)
	)
}

export const getFileDownloadUrl = ref => {
	return getDownloadURL(ref)
}

export const uploadFileTask = (currentUserId, messageId, file, type) => {
	const uploadFileRef = fileRef(
		currentUserId,
		messageId,
		`${file.name}.${type}`
	)

	return uploadBytesResumable(uploadFileRef, file.blob, {
		contentType: type
	})
}

export const listenUploadImageProgress = (
	currentUserId,
	messageId,
	file,
	type,
	callback,
	error,
	success
) => {
	const uploadTask = uploadFileTask(currentUserId, messageId, file, type)

	uploadTask.on(
		'state_changed',
		snap => {
			const progress = Math.round(
				(snap.bytesTransferred / snap.totalBytes) * 100
			)
			callback(progress)
		},
		_error => {
			error(_error)
		},
		async () => {
			const url = await getFileDownloadUrl(uploadTask.snapshot.ref)
			success(url)
		}
	)
}
