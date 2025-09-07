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
    // Open a new window with mobile/compact size
    try {
      const newWindow = window.open(
        window.location.href,
        '_blank',
        'width=337,height=940,scrollbars=yes,resizable=yes'
      );

      if (newWindow) {
        // Try to close the current window
        window.close();

        // If window.close() doesn't work (common in modern browsers for security),
        // provide a helpful message
        setTimeout(() => {
          if (!window.closed) {
            console.log(
              'Original window could not be closed automatically. Please close this tab manually and use the new compact window.'
            );
          }
        }, 100);
      } else {
        console.log(
          'Pop-up blocked. Please allow pop-ups for this site or use F12 > Device Mode for mobile testing'
        );
      }
    } catch (error) {
      console.log(
        'Could not open new window. Use F12 > Device Mode for mobile testing'
      );
    }
  };

  return (
    <nav className="header">
      <div className="header-left">
        <svg
          className="header-icon"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
        >
          <rect x="14" y="2" width="4" height="3" rx="1" fill="#4A5568" />
          <circle
            cx="16"
            cy="18"
            r="12"
            fill="#E2E8F0"
            stroke="#4A5568"
            strokeWidth="2"
          />
          <circle cx="16" cy="18" r="10" fill="#F7FAFC" />
          <g stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round">
            <line x1="16" y1="8" x2="16" y2="10" />
            <line x1="26" y1="18" x2="24" y2="18" />
            <line x1="16" y1="28" x2="16" y2="26" />
            <line x1="6" y1="18" x2="8" y2="18" />
          </g>
          <line
            x1="16"
            y1="18"
            x2="16"
            y2="12"
            stroke="#E53E3E"
            strokeWidth="1"
          />
          <line
            x1="16"
            y1="18"
            x2="21"
            y2="15"
            stroke="#2D3748"
            strokeWidth="1.5"
          />
          <circle cx="16" cy="18" r="1.5" fill="#4A5568" />
        </svg>
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
