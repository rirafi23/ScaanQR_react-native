import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyCjmefHoMoxU7SHJM8ZnmZQPC2SdqHFucE",
  authDomain: "scanqr-17f7a.firebaseapp.com",
  databaseURL: "https://scanqr-17f7a.firebaseio.com",
  projectId: "scanqr-17f7a",
  storageBucket: "scanqr-17f7a.appspot.com",
  messagingSenderId: "1063676980641",
  appId: "1:1063676980641:web:974d5cd819e019f927afe0",
}

// Initialize Firebase
export const Firebase = firebase.initializeApp(firebaseConfig)
export const db = Firebase.database()
