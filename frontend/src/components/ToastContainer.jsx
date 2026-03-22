import React from "react";
import { useUI } from "../context/UIContext.jsx";

const typeStyles = {
  success: "border-emerald-300 text-emerald-200",
  error: "border-rose-300 text-rose-200",
  info: "border-cyan-300 text-cyan-200"
};

const ToastContainer = () => {
  const { toasts } = useUI();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`glass px-4 py-3 rounded-2xl border ${
            typeStyles[toast.type] || typeStyles.info
          } shadow-glass`}
        >
          <p className="text-sm">{toast.message}</p>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;