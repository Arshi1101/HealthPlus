import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUVJ5S85q3ypMDl7Nc0w1W6vMwbCwFI0g",
  authDomain: "healthplus-b55b0.firebaseapp.com",
  projectId: "healthplus-b55b0",
  storageBucket: "healthplus-b55b0.firebasestorage.app",
  messagingSenderId: "1061659291639",
  appId: "1:1061659291639:web:439afd69f24670667788f2",
  measurementId: "G-RYZHB1B8ZG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);