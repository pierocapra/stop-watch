import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import app from './firebase';

function Login() {
    const password = useRef();
    const email = useRef();
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate();

    const [message, setMessage] = useState('')

    const login = () => {
        const loginEmail = email.current.value;
        const loginPassword = password.current.value;

        const auth = getAuth(app);

        const promise = signInWithEmailAndPassword(auth, loginEmail, loginPassword);

        promise.then(
            res => {
                const user = res.user;

                setMessage("Welcome back " + user.email)

                console.log("logged in");
                localStorage.setItem("isAuthenticated", true)
                navigate("/");

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

    return (
            <div className="authen">
                <h1>LOGIN</h1>
                <input id="email" type="email" placeholder="Enter your email" ref={email} /><br />
                <input id="pass" type="password" placeholder="Enter your password" ref={password}/><br />

                <p>{message}</p>

                <button className="button" onClick={login}>Log In</button>
                <button className="button" onClick={signup}>Sign Up</button>
            </div>
    )
}

export default Login;
