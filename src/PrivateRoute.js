import React, {useContext} from 'react';
import { Navigate } from "react-router-dom";
import { AuthContext } from './Auth';
import { useAuth } from './Auth';

const PrivateRoute = ({children}) => {
    const { currentUser } = useAuth()

    return currentUser ? children : <Navigate to="/login" />
  };

export default PrivateRoute;
