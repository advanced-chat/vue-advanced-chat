import * as app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

const config = JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG) || {
	apiKey: 'AIzaSyCVy3Oc1jgvacBZe5hKBA8mV9EOqmqUG0U',
	authDomain: 'sandbox-public.firebaseapp.com',
	databaseURL: 'https://sandbox-public.firebaseio.com',
	projectId: 'sandbox-public',
	storageBucket: 'sandbox-public.appspot.com',
	messagingSenderId: '694742394920',
	appId: '1:694742394920:web:af0d589c7618f85ccc2d1d'
}

app.initializeApp(config)

export const firebase = app
export const db = app.firestore()
export const storageRef = app.storage().ref()

export const usersRef = db.collection('users')
export const roomsRef = db.collection('chatRooms')

export const filesRef = storageRef.child('files')

export const dbTimestamp = firebase.firestore.FieldValue.serverTimestamp()
export const deleteDbField = firebase.firestore.FieldValue.delete()
