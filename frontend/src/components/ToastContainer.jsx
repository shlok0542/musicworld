import React from "react";
import { AnimatePresence, motion } from "framer-motion";
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
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6">
      <div className="flex w-full max-w-md flex-col items-center gap-3">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              role={toast.type === "error" ? "alert" : "status"}
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className={`pointer-events-auto w-full rounded-2xl border px-4 py-3 ${
                typeStyles[toast.type] || typeStyles.info
              } glass shadow-glass`}
            >
              <p className="text-center text-sm">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ToastContainer;