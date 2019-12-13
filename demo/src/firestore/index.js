import * as app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

// const config = {
// 	apiKey: 'AIzaSyCVy3Oc1jgvacBZe5hKBA8mV9EOqmqUG0U',
// 	authDomain: 'sandbox-public.firebaseapp.com',
// 	databaseURL: 'https://sandbox-public.firebaseio.com',
// 	projectId: 'sandbox-public',
// 	storageBucket: 'sandbox-public.appspot.com',
// 	messagingSenderId: '694742394920',
// 	appId: '1:694742394920:web:af0d589c7618f85ccc2d1d'
// }

const config = {
	apiKey: 'AIzaSyAp_VqNngNGQMRMDSag10xqGTap-G6FM9E',
	authDomain: 'sandbox-226704.firebaseapp.com',
	databaseURL: 'https://sandbox-226704.firebaseio.com',
	projectId: 'sandbox-226704',
	storageBucket: 'sandbox-226704.appspot.com',
	messagingSenderId: '1015649565816',
	appId: '1:1015649565816:web:1a79587b436517599cc18d'
}

app.initializeApp(config)
// app.initializeApp(JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG_PUBLIC))

export const firebase = app
export const db = app.firestore()
export const storageRef = app.storage().ref()

export const usersRef = db.collection('users')
export const roomsRef = db.collection('chatRooms')

export const filesRef = storageRef.child('files')

export const dbTimestamp = firebase.firestore.FieldValue.serverTimestamp()
export const deleteDbField = firebase.firestore.FieldValue.delete()
