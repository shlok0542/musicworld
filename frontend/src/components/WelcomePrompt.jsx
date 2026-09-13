import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const DISMISS_KEY = "mw-welcome-prompt-dismissed";

const WelcomePrompt = () => {
  const { user, token, ready } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dismissed, setDismissed] = React.useState(
    () => localStorage.getItem(DISMISS_KEY) === "true"
  );

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  const openAuth = (mode) => {
    dismiss();
    navigate(`/auth?mode=${mode}`);
  };

  const isVisible = ready && !user && !token && !dismissed && location.pathname !== "/auth";

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0b0a12]/60 backdrop-blur-sm">
      <section
        className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/15 bg-[#17151f]/95 p-7 shadow-[0_24px_80px_rgba(7,4,14,0.6)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-pink-500" />
        <button
          type="button"
          aria-label="Close welcome dialog"
          onClick={dismiss}
          className="absolute right-4 top-4 h-9 w-9 rounded-full border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
        >
          &#215;
        </button>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Welcome to MusicWorlds</p>
        <h2 id="welcome-title" className="mt-3 pr-8 text-2xl font-semibold">
          Make your music feel personal.
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/60">
          Sign in to save songs, create playlists, and keep your listening history in sync.
        </p>
        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="rounded-full border border-white/15 px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => openAuth("signup")}
            className="rounded-full bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-900"
          >
            Sign up
          </button>
        </div>
      </section>
    </div>
  );
};

export default WelcomePrompt;
