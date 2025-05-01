import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
  
    useEffect(() => {
      const handleAuthChange = () => {
        setToken(localStorage.getItem("token"));
      };
      window.addEventListener("authChange", handleAuthChange);
      return () => window.removeEventListener("authChange", handleAuthChange);
    }, []);
  
    const login = (newToken) => {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      window.dispatchEvent(new Event("authChange"));
    };
  
    const logout = () => {
      localStorage.removeItem("token");
      setToken(null);
      window.dispatchEvent(new Event("authChange"));
    };
  
    return (
      <AuthContext.Provider value={{ token, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  