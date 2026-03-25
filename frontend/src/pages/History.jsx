import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import SongCard from "../components/SongCard.jsx";
import { clearHistory, getProfile } from "../services/userService.js";
import { useUI } from "../context/UIContext.jsx";

const History = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const { showToast, startLoading, stopLoading } = useUI();

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    getProfile()
      .then((profile) => setSongs(profile?.history || []))
      .catch(() => undefined);
  }, [token]);

  if (!token) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-36">
      <div className="glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">History</p>
          <h2 className="text-2xl md:text-3xl font-semibold mt-2">Recently played</h2>
        </div>
        <button
          className="px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] border border-white/10 text-white/70 hover:text-white"
          onClick={async () => {
            if (!window.confirm("Clear all history?")) return;
            startLoading();
            try {
              await clearHistory();
              setSongs([]);
              showToast({ type: "success", message: "History cleared." });
            } catch {
              showToast({ type: "error", message: "Unable to clear history." });
            } finally {
              stopLoading();
            }
          }}
        >
          Clear All
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        {songs.length === 0 && (
          <div className="glass rounded-2xl p-6 text-center text-white/60">
            No history yet. Play a track to start building your timeline.
          </div>
        )}
        {songs.map((song) => (
          <SongCard key={song.songId} song={song} list={songs} playIcon />
        ))}
      </div>
    </div>
  );
};

export default History;
