import React, {useState, useEffect}  from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from './Auth';

const PrivateRoute = ({children}) => {
  const {currentUser, isInitialized}  = useAuth()

  if (!isInitialized) {
    // Render a loading state or a different component while authentication initializes
    return <div>Initializing...</div>;
  } else {
    return currentUser ? children : <Navigate to="/login" />
  }

};

export default PrivateRoute;
