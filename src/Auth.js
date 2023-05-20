import React, { useRef, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

import Main from './main';

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
// const analytics = getAnalytics(app);


function Auth() {
    const password = useRef();
    const email = useRef();
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const [message, setMessage] = useState('')

    const login = () => {
        const loginEmail = email.current.value;
        const loginPassword = password.current.value;


        const auth = getAuth(app);

        const promise = signInWithEmailAndPassword(auth, loginEmail, loginPassword);

        promise.then(
            res => {
                const user = res.user;
                const lout = document.getElementById('logout');

                setMessage("Welcome back " + user.email)
                lout.classList.remove('hide')

                console.log("logged in");
                
                setIsLoggedIn(true)
            }
        )
        promise.catch(e => {
            const err = e.message;
            setMessage(err)
        })
    }

    const signup = () => {
        const signupEmail = email.current.value;
        const signupPassword = password.current.value;
        const auth = getAuth(app);

        const promise = createUserWithEmailAndPassword(auth, signupEmail, signupPassword);

        promise
        .then(res => {
            const user = res.user;
            const message = "Welcome " + user.email;

            const db = getDatabase(app);
            set(ref(db, 'users/' + user.uid), {
            email: user.email
            });

            setMessage(message)
        });

        promise.catch(e => {
            const err = e.message;
            console.log("Error: " + err);
            setMessage(err)
        })
        
    }

    const logout = () => {
        const auth = getAuth(app);
        signOut(auth);

        const lout = document.getElementById('logout');

        setMessage("You are now logged out ")
        lout.classList.add('hide')

    }

    if (isLoggedIn) {
        return <Navigate to='/main' />
    }

    return (
        <>
                <div className="authen">
                    <input id="email" type="email" placeholder="Enter your email" ref={email} /><br />
                    <input id="pass" type="password" placeholder="Enter your password" ref={password}/><br />

                    <p>{message}</p>

                    <button className="button" onClick={login}>Log In</button>
                    <button className="button" onClick={signup}>Sign Up</button>
                    <button onClick={logout}id="logout" className="button hide">Log Out</button>
                </div>
        </>
    )
}

export default Auth;
