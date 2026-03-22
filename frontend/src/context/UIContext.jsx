import React, { createContext, useContext, useMemo, useState } from "react";

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [loadingCount, setLoadingCount] = useState(0);

  const showToast = (toast) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const payload = { id, type: "info", duration: 3000, ...toast };
    setToasts((prev) => [...prev, payload]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, payload.duration);
  };

  const startLoading = () => setLoadingCount((c) => c + 1);
  const stopLoading = () => setLoadingCount((c) => Math.max(0, c - 1));

  const value = useMemo(
    () => ({ toasts, showToast, loadingCount, startLoading, stopLoading }),
    [toasts, loadingCount]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside UIProvider");
  return ctx;
};