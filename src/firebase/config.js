import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBt-9ZXZghsdiXSGaKm5jwQfCF3PeUJ8i8",
  authDomain: "ricettario-8614b.firebaseapp.com",
  projectId: "ricettario-8614b",
  storageBucket: "ricettario-8614b.firebasestorage.app",
  messagingSenderId: "668072301006",
  appId: "1:668072301006:web:f787b2740439ff40c35b9f"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
