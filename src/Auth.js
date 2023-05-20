import React, {useState, useEffect} from "react";
import app from "./firebase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Initialize Firebase Authentication and get a reference to the service
// const auth = getAuth(app);

export const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);

    const auth = getAuth(app);

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            setCurrentUser(user)
          });
    }, []);

    return (
        <AuthContext.Provider value={{currentUser}}>
            {children}
        </AuthContext.Provider>
    );
};