import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const config =
	process.env.NODE_ENV === 'development'
		? JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG)
		: JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG_PUBLIC)

initializeApp(config)

export const firestoreDb = getFirestore()
export const realtimeDb = getDatabase()
export const storage = getStorage()
