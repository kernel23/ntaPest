// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB3yPx1dWJQwqn-SglOjGzrQ6BAZFngMDc",
    authDomain: "pest-monitoring-app-ph.firebaseapp.com",
    projectId: "pest-monitoring-app-ph",
    storageBucket: "pest-monitoring-app-ph.firebasestorage.app",
    messagingSenderId: "948653534237",
    appId: "1:948653534237:web:dc195109343b4d5a12eaf4",
    measurementId: "G-YRFNHDN5VV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
