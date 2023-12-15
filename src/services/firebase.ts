// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
    apiKey: "AIzaSyBpvzRpap-X4qyoBJ3mRSab08c_1sBQa6s",
    authDomain: "perfect-digital-e2fb2.firebaseapp.com",
    databaseURL: "https://perfect-digital-e2fb2-default-rtdb.firebaseio.com",
    projectId: "perfect-digital-e2fb2",
    storageBucket: "perfect-digital-e2fb2.appspot.com",
    messagingSenderId: "896716918465",
    appId: "1:896716918465:web:1f918758624d8028b18e40",
    measurementId: "G-BK2Z6X7LCP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fdb = getDatabase(app);
const fAuth = getAuth(app);
const fStorage = getStorage(app);

export { fdb, fAuth, fStorage };