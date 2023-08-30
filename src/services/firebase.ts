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
    apiKey: "AIzaSyBZcoJBfB5qmB0jPMNzdCxbuyDJLt3ty0o",
    authDomain: "perfectds-a3d3f.firebaseapp.com",
    databaseURL: "https://perfectds-a3d3f-default-rtdb.firebaseio.com",
    projectId: "perfectds-a3d3f",
    storageBucket: "perfectds-a3d3f.appspot.com",
    messagingSenderId: "1089347137100",
    appId: "1:1089347137100:web:18babf8ea349fbd82dcee9",
    measurementId: "G-JECX085JJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fdb = getDatabase(app);
const fAuth = getAuth(app);
const fStorage = getStorage(app);

export { fdb, fAuth, fStorage };