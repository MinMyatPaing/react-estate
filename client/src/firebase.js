// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-project-68a05.firebaseapp.com",
  projectId: "estate-project-68a05",
  storageBucket: "estate-project-68a05.appspot.com",
  messagingSenderId: "992002718047",
  appId: "1:992002718047:web:5229e30bd3bf15ffe25eea",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
