// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-1u6A_-u6gl-sreUO9508BZhywJlRCAM",
  authDomain: "touch-base-801d0.firebaseapp.com",
  projectId: "touch-base-801d0",
  storageBucket: "touch-base-801d0.appspot.com",
  messagingSenderId: "598399294147",
  appId: "1:598399294147:web:2b6966fa1b8f9473dce076"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// Initialize Google Auth Provider
export const provider = new GoogleAuthProvider();