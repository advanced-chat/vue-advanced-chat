import * as app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/storage'

const config =
	process.env.NODE_ENV === 'development'
		? JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG)
		: JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG_PUBLIC)

app.initializeApp(config)

export const firebase = app
export const db = app.firestore()
export const storageRef = app.storage().ref()

export const usersRef = db.collection(process.env.VUE_APP_USERS_COLLECTION)
export const roomsRef = db.collection(process.env.VUE_APP_CHAT_ROOMS_COLLECTION)

export const filesRef = storageRef.child(process.env.VUE_APP_FILE_BUCKET)

export const dbTimestamp = firebase.firestore.FieldValue.serverTimestamp()
export const deleteDbField = firebase.firestore.FieldValue.delete()
