import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authApi from "../api/auth";
import { setToken, clearToken, getToken } from "../api/client";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = getToken();
    const user_id = localStorage.getItem("auth_user_id");
    const role = localStorage.getItem("auth_role");
    return token && user_id ? { user_id, role } : null;
  });
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      localStorage.removeItem("auth_user_id");
      localStorage.removeItem("auth_role");
      setSessionExpired(true);
    };
    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, []);

  const login = useCallback(async (user_id, password) => {
    const data = await authApi.login({ user_id, password });
    setToken(data.token);
    localStorage.setItem("auth_user_id", user_id);
    localStorage.setItem("auth_role", data.role);
    setUser({ user_id, role: data.role });
    setSessionExpired(false);
    return data;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    localStorage.removeItem("auth_user_id");
    localStorage.removeItem("auth_role");
    setUser(null);
  }, []);

  const dismissSessionExpired = useCallback(() => setSessionExpired(false), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        sessionExpired,
        dismissSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
