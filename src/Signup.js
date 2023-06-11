import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import {  updateProfile } from "firebase/auth";
import Spinner from './components/Spinner';

import { useAuth } from './Auth';

function Signup() {
    const passwordRef = useRef();
    const passwordConfirmRef = useRef()
    const emailRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const { signup } = useAuth();

    async function handleSubmit(e) { 
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
          return setError("Passwords do not match")
        }
    
        setError("")
        setLoading(true)

        await signup(emailRef.current.value, passwordRef.current.value)
          .then((userCredential) => {
              // Signed in 
              updateProfile(userCredential.user, {
                  displayName:  firstNameRef.current.value + " " + lastNameRef.current.value
              })

              // setTimeout is a bit hacky, can think of different solution
              setTimeout(()=>{navigate("/")}, 500)    
          })
          .catch((error) => {
            setError("Failed to create an account: " + error.code)
          });

        setLoading(false)
      }

    return (
      <>
        {loading && <Spinner />}
          <div className="container">
            <div className="auth">
                <h1>SIGNUP</h1>
                <form onSubmit={handleSubmit}>
                  <input id="firstName" type="text" placeholder="First Name" ref={firstNameRef} required/><br />
                  <input id="lastName" type="text" placeholder="Last Name" ref={lastNameRef} required/><br />
                  <input id="email" type="email" placeholder="Email" ref={emailRef} required/><br />
                  <input id="pass" type="password" placeholder="Password" ref={passwordRef} required/><br />
                  <input id="pass" type="password" placeholder="Confirm Password" ref={passwordConfirmRef} required/><br />

                  {error && <h4 className="error-message">{error}</h4>}

                  <button type="submit" className="button" >Sign Up</button>
                </form>

                <div className="additional-form-text">
                    Already have an account? <Link to="/login">Log In</Link>
                </div>
            </div>
          </div>       
      </>
    )
}

export default Signup;
