import React, {useContext} from 'react';
import { Navigate } from "react-router-dom";
import { AuthContext } from './Auth';



const PrivateRoute = ({children}) => {
    // const { currentUser } = useContext(AuthContext);
    const isAuthenticated = localStorage.getItem("isAuthenticated")

    return isAuthenticated ? children : <Navigate to="/login" />
  };

export default PrivateRoute;
