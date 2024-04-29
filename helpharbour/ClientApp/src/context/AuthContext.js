import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null); // State to hold user details

    const setLoggedIn = (loggedIn, userDetails) => {
        setIsLoggedIn(loggedIn);
        setUser(userDetails); // Set user details when logged in
        
    };
    
    return (
        <AuthContext.Provider value={{ isLoggedIn, user, setLoggedIn }}>  {/* Pass the user state to the provider*/}
    
            {children}
        </AuthContext.Provider>
    );
};
