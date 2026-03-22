import React from "react";
import { useUI } from "../context/UIContext.jsx";

const LoaderOverlay = () => {
  const { loadingCount } = useUI();
  if (loadingCount <= 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
      <div className="glass rounded-2xl px-6 py-5 flex items-center gap-3">
        <div className="h-4 w-4 rounded-full border-2 border-emerald-300 border-t-transparent animate-spin" />
        <p className="text-sm text-white/80">Loading...</p>
      </div>
    </div>
  );
};

export default LoaderOverlay;