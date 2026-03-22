import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProfile } from "../services/userService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("mw-token");
    const storedUser = localStorage.getItem("mw-user");
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));

    if (storedToken) {
      getProfile()
        .then((profile) => {
          if (profile) {
            setUser(profile);
            localStorage.setItem("mw-user", JSON.stringify(profile));
          }
        })
        .catch(() => {
          setToken(null);
          setUser(null);
          localStorage.removeItem("mw-token");
          localStorage.removeItem("mw-user");
        });
    }
  }, []);

  const login = (payload) => {
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem("mw-token", payload.token);
    localStorage.setItem("mw-user", JSON.stringify(payload.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("mw-token");
    localStorage.removeItem("mw-user");
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};