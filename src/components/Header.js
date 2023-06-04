import React, {useState} from 'react';
import { useAuth } from '../Auth';
import { useNavigate } from 'react-router-dom';


const Header = () => {
    const [error, setError] = useState(null);
    const { logout } = useAuth()
    const navigate = useNavigate();
    
      async function handleLogout() {
        setError("")
    
        try {
          await logout()
          navigate("/login")
        } catch {
          setError("Failed to log out")
          console.log(error);
        }
      }

    const {currentUser}  = useAuth();
    console.log(currentUser.displayName);

    return (
        <nav className="header">
            <div className="header-left">
                <h3>STOPWATCH</h3>
            </div>

            <div className="header-right">
                {currentUser && <>
                    <p> Hello {currentUser.displayName} </p>
                
                    <button className="button" onClick={handleLogout}>SignOut</button> 
                    </>
                }
            </div>
        </nav>
    )
}

export default Header
