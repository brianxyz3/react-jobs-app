// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrIrIq8TNkTrS_0XpasnCmfv17_vUR_l0",
  authDomain: "react-jobs-app.firebaseapp.com",
  projectId: "react-jobs-app",
  storageBucket: "react-jobs-app.firebasestorage.app",
  messagingSenderId: "677828712908",
  appId: "1:677828712908:web:bca8c9b9ffe12c8effe569",
  measurementId: "G-N0RPRVP5WM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
