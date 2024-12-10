import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(() => {
        // Initialize from localStorage, or empty string if not found
        return localStorage.getItem('authToken') || '';
    });

    // Whenever authToken changes, update localStorage
    useEffect(() => {
        if (authToken) {
            localStorage.setItem('authToken', authToken);
        } else {
            // Remove the token from localStorage if it's empty
            localStorage.removeItem('authToken');
        }
    }, [authToken]);

    // Logout function to clear the token
    const logout = () => {
        setAuthToken('');
        localStorage.removeItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ 
            authToken, 
            setAuthToken, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using auth context
export const useAuth = () => {
    return useContext(AuthContext);
};