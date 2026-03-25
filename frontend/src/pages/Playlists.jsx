import React from "react";
import { useNavigate } from "react-router-dom";
import { useUI } from "../context/UIContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Playlists = () => {
  const { showToast } = useUI();
  const { token } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-36 space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => {
            if (!token) {
              showToast({ type: "error", message: "Login to view favorites." });
              return;
            }
            navigate("/library/favorites");
          }}
          className="glass rounded-3xl p-5 flex items-center gap-4 text-left hover:border-white/20 border border-white/10"
        >
          <div className="h-12 w-12 rounded-2xl bg-rose-400/20 text-rose-200 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7-4.35-9-8.5C1.5 9 3.5 6 6.5 6c2 0 3.2 1 4.1 2.3C11.3 7 12.5 6 14.5 6 17.5 6 19.5 9 21 12.5 19 16.65 12 21 12 21z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-white/60">Favorites</p>
            <h3 className="text-lg font-semibold">Liked Songs</h3>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate("/library/playlists")}
          className="glass rounded-3xl p-5 flex items-center gap-4 text-left hover:border-white/20 border border-white/10"
        >
          <div className="h-12 w-12 rounded-2xl bg-emerald-400/20 text-emerald-200 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h10" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-white/60">Library</p>
            <h3 className="text-lg font-semibold">Playlists</h3>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Playlists;
