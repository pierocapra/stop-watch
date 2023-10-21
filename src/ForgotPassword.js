import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from './Auth';

// COMPONENTS
import Spinner from './components/Spinner';
import Header from './components/Header';

export default function ForgotPassword() {
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')


    async function handleSubmit(e) {
        e.preventDefault()

          setMessage('')
          setError("")
          setLoading(true)
          await resetPassword(emailRef.current.value)
            .then(() => {
              setMessage("Check your inbox for instructions")
            })
            .catch(error => {
              setError("Failed to reset password: " +error.message)
            });
          setLoading(false)
    }


    return (
        <>
          <Header />
          {loading && <Spinner />}
          <div className="container">
            <div className="auth">
                <h1>Forgot Password</h1>
                <form onSubmit={handleSubmit}>
                  <input id="email" type="email" placeholder="Enter your email" ref={emailRef} required/>
                  <br />
                  {error && <h4 className="error-message">{error}</h4>}
                  {message && <p>{message}</p>}
                  <button type="submit" className="button">Reset Password</button>
                </form>
                <Link to="/login" className="additional-form-text">Back to Login</Link>
            </div>
          </div>
        </>  
    )
}
