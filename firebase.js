// firebase.js or firebase.ts

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWwC_iKLCHJ5UX5fL3jZpcCbc4OkjFC-8",
  authDomain: "flashcard-saas-app-f2dd2.firebaseapp.com",
  projectId: "flashcard-saas-app-f2dd2",
  storageBucket: "flashcard-saas-app-f2dd2.appspot.com",
  messagingSenderId: "1097822398966",
  appId: "1:1097822398966:web:0d0c19d8245c5c50a5ffd7",
  measurementId: "G-2DSHL6RZ70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
