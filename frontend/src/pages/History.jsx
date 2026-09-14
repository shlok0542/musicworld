import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import SongCard from "../components/SongCard.jsx";
import { deleteHistorySong, getProfile } from "../services/userService.js";
import { useUI } from "../context/UIContext.jsx";

const History = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const { showToast } = useUI();

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
      <div className="mt-6 grid gap-4">
        {songs.length === 0 && (
          <div className="glass rounded-2xl p-6 text-center text-white/60">
            No history yet. Play a track to start building your timeline.
          </div>
        )}
        {songs.map((song) => (
          <SongCard
            key={song.songId}
            song={song}
            list={songs}
            onDelete={async () => {
              try {
                await deleteHistorySong(song.songId);
                setSongs((previous) => previous.filter((item) => item.songId !== song.songId));
                showToast({ type: "success", message: "Removed from history." });
              } catch {
                showToast({ type: "error", message: "Unable to remove history item." });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default History;
