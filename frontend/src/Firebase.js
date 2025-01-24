// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAs6hXcZy3VDbzWuhJVWTy1cuVoOvrb2z0",
  authDomain: "buynsell-e6da5.firebaseapp.com",
  projectId: "buynsell-e6da5",
  storageBucket: "buynsell-e6da5.firebasestorage.app",
  messagingSenderId: "321762182176",
  appId: "1:321762182176:web:4cd0ddd7794c8801226845",
  measurementId: "G-0SNK5C1QK1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);