// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBKLo8XHb7mB-c0RoUA5Qz-fNLvIgz0js8",
    authDomain: "stopwatch-7c6c4.firebaseapp.com",
    databaseURL: "https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "stopwatch-7c6c4",
    storageBucket: "stopwatch-7c6c4.appspot.com",
    messagingSenderId: "313167662235",
    appId: "1:313167662235:web:ed3c95c647b24599fd8a3e"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;