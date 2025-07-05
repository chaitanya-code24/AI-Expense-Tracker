// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWssTdvByeYpw-PIv_RvCZ98L6nhQbCgk",
  authDomain: "ai-expense-manager-fe515.firebaseapp.com",
  projectId: "ai-expense-manager-fe515",
  storageBucket: "ai-expense-manager-fe515.firebasestorage.app",
  messagingSenderId: "6777424196",
  appId: "1:6777424196:web:468190c99198fea6736f11",
  measurementId: "G-48VM0P6K3Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);