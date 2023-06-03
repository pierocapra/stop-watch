import React, {useState, useEffect}  from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from './Auth';
import app from "./firebase.js";
import { getAuth } from "firebase/auth";

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const PrivateRoute = ({children}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const {currentUser}  = useAuth()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await auth._initializationPromise;
        setIsInitialized(true);
        console.log(currentUser);
      } catch (error) {
        // Handle error if authentication initialization fails
        console.error(error);
      }
    };

    initializeAuth();
  }, []);

  if (!isInitialized) {
    // Render a loading state or a different component while authentication initializes
    return <div>Loading...</div>;
  } else {
    return currentUser ? children : <Navigate to="/login" />
  }

};

export default PrivateRoute;
