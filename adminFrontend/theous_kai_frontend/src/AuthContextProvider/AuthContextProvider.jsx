import React, { createContext, useState, useContext, useEffect } from "react";
export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem("authToken") || "";
  });
  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [authToken]);
  const logout = () => {
    setAuthToken("");
    localStorage.removeItem("authToken");
  };
  return (
    <AuthContext.Provider
      value={{
        authToken,
        setAuthToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
