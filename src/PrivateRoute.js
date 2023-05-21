import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from './Auth';

const PrivateRoute = ({children}) => {
    const currentUser  = useAuth()
    // console.log(currentUser.currentUser.email);

    return currentUser ? children : <Navigate to="/login" />
  };

export default PrivateRoute;
