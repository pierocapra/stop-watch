import React  from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from './Auth';

// COMPONENTS
import Spinner from './components/Spinner';

const PrivateRoute = ({children}) => {
  const {currentUser, isInitialized}  = useAuth()

  if (!isInitialized) {
    // Render a loading state or a different component while authentication initializes
    return <Spinner />;
  } else {
    return currentUser ? children : <Navigate to="/login" />
  }

};

export default PrivateRoute;
