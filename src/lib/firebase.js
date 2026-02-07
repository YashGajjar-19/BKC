// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCEX1gFmdDoczTsOv0G6DTqzBpSFXqCfmI",
    authDomain: "bakchodi-1.firebaseapp.com",
    projectId: "bakchodi-1",
    storageBucket: "bakchodi-1.firebasestorage.app",
    messagingSenderId: "120357564426",
    appId: "1:120357564426:web:2079ba46811f49b60e6ff3",
    measurementId: "G-DRRJDV7FL4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, db, googleProvider };
