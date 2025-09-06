import React, { useState } from 'react';
import { useAuth } from '../Auth';
import { useNavigate } from 'react-router-dom';

const Header = (props) => {
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError('');

    try {
      await logout();
      navigate('/login');
    } catch {
      setError('Failed to log out');
      console.log(error);
    }
  }

  function handleSignup() {
    navigate('/signup');
  }

  const { currentUser } = useAuth();

  function getInitials(name) {
    const nameArray = name.split(' '); // Split the name into an array of words
    const initials = nameArray.map((word) => word.charAt(0).toUpperCase()); // Get the first character of each word and capitalize it
    return initials.join(''); // Join the initials into a single string
  }

  const handleResize = () => {
    // Try to resize the current window to mobile/compact size
    try {
      window.resizeTo(337, 940);
    } catch (error) {
      // If blocked, provide helpful console message
      console.log(
        'Window resize blocked by browser. Use F12 > Device Mode for mobile testing'
      );
    }
  };

  return (
    <nav className="header">
      <div className="header-left">
        <h3>STOPWATCH</h3>
      </div>
      {props.isTestPage && (
        <div className="header-right">
          <p> Test the app </p>
          <button className="button resize-button" onClick={handleResize}>
            Resize
          </button>
          <button className="button" onClick={handleSignup}>
            Signup
          </button>
        </div>
      )}
      {!props.isTestPage && (
        <div className="header-right">
          {currentUser && (
            <>
              <p> Hello {currentUser.displayName} </p>
              {currentUser.displayName ? (
                <div className="initials-tag">
                  {' '}
                  {getInitials(currentUser.displayName)}{' '}
                </div>
              ) : (
                ''
              )}
              <button className="button resize-button" onClick={handleResize}>
                Resize
              </button>
              <button className="button" onClick={handleLogout}>
                SignOut
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
