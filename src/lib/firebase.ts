// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSWiNsbcm1iYQwFOqQ0lP04gnifrKolhs",
  authDomain: "nutriplus-72271.firebaseapp.com",
  projectId: "nutriplus-72271",
  storageBucket: "nutriplus-72271.firebasestorage.app",
  messagingSenderId: "920005003427",
  appId: "1:920005003427:web:85831d760d615428875716",
  measurementId: "G-NCXS94ZL27"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);