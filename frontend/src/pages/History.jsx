import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import SongCard from "../components/SongCard.jsx";
import { getProfile } from "../services/userService.js";

const History = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);

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
      <div className="glass rounded-3xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">History</p>
        <h2 className="text-2xl md:text-3xl font-semibold mt-2">Recently played</h2>
      </div>

      <div className="mt-6 grid gap-4">
        {songs.length === 0 && (
          <div className="glass rounded-2xl p-6 text-center text-white/60">
            No history yet. Play a track to start building your timeline.
          </div>
        )}
        {songs.map((song) => (
          <SongCard key={song.songId} song={song} list={songs} />
        ))}
      </div>
    </div>
  );
};

export default History;