import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set } from "firebase/database";
import app from './firebase';
import { Link } from "react-router-dom"

import { useAuth } from './Auth';

function Signup() {
    const passwordRef = useRef();
    const passwordConfirmRef = useRef()
    const emailRef = useRef();
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [message, setMessage] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
    
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
          return setError("Passwords do not match")
        }
    
        try {
          setError("")
          setLoading(true)
          await signup(emailRef.current.value, passwordRef.current.value)
          navigate("/")
        } catch {
          setError("Failed to create an account")
        }
    
        setLoading(false)
      }

    return (
            <div className="authen">
                <h1>SIGNUP</h1>
                {error && <h2>{error}</h2>}
                <input id="email" type="email" placeholder="Enter your email" ref={emailRef} /><br />
                <input id="pass" type="password" placeholder="Enter your password" ref={passwordRef}/><br />
                <input id="pass" type="password" placeholder="Confirm your password" ref={passwordConfirmRef}/><br />

                <p>{message}</p>

                <button className="button" onClick={handleSubmit}>Sign Up</button>

                <div>
                    Already have an account? <Link to="/login">Log In</Link>
                </div>
            </div>
    )
}

export default Signup;
