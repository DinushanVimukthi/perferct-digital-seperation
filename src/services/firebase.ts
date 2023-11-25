// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
/*
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
*/

const firebaseConfig = {
    apiKey: "AIzaSyCNwbb2zrfVwHCu4iB4K2CKYg-peEkSpn4",
    authDomain: "perfect-digital-2278a.firebaseapp.com",
    databaseURL: "https://perfect-digital-2278a-default-rtdb.firebaseio.com",
    projectId: "perfect-digital-2278a",
    storageBucket: "perfect-digital-2278a.appspot.com",
    messagingSenderId: "252182299616",
    appId: "1:252182299616:web:8be6e493026872268c6185",
    measurementId: "G-1R8QS40YCB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fdb = getDatabase(app);
const fAuth = getAuth(app);
const fStorage = getStorage(app);

export { fdb, fAuth, fStorage };