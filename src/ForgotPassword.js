import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from './Auth';

export default function ForgotPassword() {
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')


    async function handleSubmit(e) {
        e.preventDefault()

        
        try {
            console.log("test");
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
            <div className="authen">
                <h1>Forgot Password</h1>
                <input id="email" type="email" placeholder="Enter your email" ref={emailRef} /><br />
                <br />
                {message}
                <button className="button" onClick={handleSubmit}>Reset Password</button><br/>
                <Link to="/login">Login</Link>
            </div>
    )
}
