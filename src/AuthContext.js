import React, { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [admin, setAdmin] = useState(false);

  // Laget av Jørgen og ChatGPT
  // Decoder JWT og henter ut informasjond
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setAuthData(decodedToken);
      setAdmin(decodedToken.admin); // Gjør at token blir admin om den har disse rettighetene fra før
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authData, setAuthData, admin }}>
      {children}
    </AuthContext.Provider>
  );
};
