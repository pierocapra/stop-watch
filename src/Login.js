import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from './Auth';

// COMPONENTS
import Spinner from './components/Spinner';

function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault()

        setError("")
        setLoading(true)
        await login(emailRef.current.value, passwordRef.current.value)
          .then((userCredential) => {
            // Signed in 
            navigate("/")
          })
          .catch((error) => {
            setError("Failed to log in: " + error.code)
          });
        setLoading(false)
      }


    return (
      <>
        {loading && <Spinner />}
        <div className="container">
            <div className="auth">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                  <input id="email" type="email" placeholder="Enter your email" ref={emailRef} required/><br />
                  <input id="pass" type="password" placeholder="Enter your password" ref={passwordRef} required/><br />

                  {error && <h4 className="error-message">{error}</h4>}

                  <button type="submit" className="button">Log In</button>
                </form>
                <Link to="/forgot-password" className="additional-form-text">Forgot Password?</Link>
                <div className="additional-form-text">
                    Need an account? <Link to="/signup">Sign Up</Link>
                </div>
            </div>
        </div>
      </>
    )
}

export default Login;
