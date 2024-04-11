import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDxuUnUSC3UwIb_P3OgGCV-4s6IQGHR-LU",
    authDomain: "readnlearn-67a81.firebaseapp.com",
    projectId: "readnlearn-67a81",
    storageBucket: "readnlearn-67a81.appspot.com",
    messagingSenderId: "836644752607",
    appId: "1:836644752607:web:bfa717d54026343b956d6a",
    measurementId: "G-QVW2ZZZR9Q"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

export default {app, auth};