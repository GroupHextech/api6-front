import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { logout as firebaseLogout } from "../services/authService"; // Importando o logout do authService

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [userData, setUserData] = useState(() => {
    const storedUserData = localStorage.getItem("userData");
    return storedUserData ? JSON.parse(storedUserData) : null;
  });
  const timeoutRef = useRef(null);

  const logout = async () => {
    try {
      await firebaseLogout(); // Usando a função de logout do authService
      setCurrentUser(null);
      setAuthenticated(false);
      setUserData(null);
      localStorage.removeItem("userData");
      clearTimeout(timeoutRef.current);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const id = setTimeout(logout, 1 * 60 * 1000); // 1min
    timeoutRef.current = id;
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthenticated(!!user);
      setLoading(false);

      if (user) {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
        resetTimer();
      } else {
        setUserData(null);
        localStorage.removeItem("userData");
      }
    });

    const events = ["mousemove", "keypress", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      unsubscribe();
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const updateUserData = (data) => {
    setUserData(data);
    localStorage.setItem("userData", JSON.stringify(data));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAuthenticated,
        setAuthenticated,
        userData,
        setUserData: updateUserData,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
