import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from './Auth';

// COMPONENTS
import Spinner from './components/Spinner';

export default function ForgotPassword() {
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')


    async function handleSubmit(e) {
        e.preventDefault()

        try {
          setMessage('')
          setError("")
          setLoading(true)
          setMessage("Check your inbox for instructions")
          await resetPassword(emailRef.current.value)
        } catch {
          setError("Failed to reset password")
        }
    
        setLoading(false)
      }


    return (
        <>
          {loading && <Spinner />}
          <div className="container">
            <div className="auth">
                <h1>Forgot Password</h1>
                <input id="email" type="email" placeholder="Enter your email" ref={emailRef} />
                <br />
                {error && <h4 className="error-message">{error}</h4>}
                {message}
                <button className="button" onClick={handleSubmit}>Reset Password</button>
                <Link to="/login" className="additional-form-text">Back to Login</Link>
            </div>
          </div>
        </>  
    )
}
