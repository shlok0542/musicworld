import React from "react";
import { useUI } from "../context/UIContext.jsx";

const typeStyles = {
  success: "border-emerald-300 text-emerald-200",
  error: "border-rose-300 text-rose-200",
  info: "border-cyan-300 text-cyan-200"
};

const ToastContainer = () => {
  const { toasts, showToast } = useUI();

  React.useEffect(() => {
    const handleRateLimit = () => {
      showToast({
        type: "error",
        duration: 6000,
        message: "Music services are temporarily busy. Please try again in a little while."
      });
    };

    window.addEventListener("mw-rate-limit", handleRateLimit);
    return () => window.removeEventListener("mw-rate-limit", handleRateLimit);
  }, [showToast]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.type === "error" ? "alert" : "status"}
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