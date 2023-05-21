import React, {useContext, useState, useEffect} from "react";
import app from "./firebase.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
  }

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false)

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        signOut(auth);
    }

    function resetPassword(email) {
        sendPasswordResetEmail(auth, email);
    }
      
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user)
            setLoading(false);
        });
        return unsubscribe;  
    }, []);
        
    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};