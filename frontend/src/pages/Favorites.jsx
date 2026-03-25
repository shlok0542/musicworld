import React, { useEffect, useState } from "react";
import SongCard from "../components/SongCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { getProfile, toggleLike } from "../services/userService.js";

const Favorites = () => {
  const { token } = useAuth();
  const { showToast, startLoading, stopLoading } = useUI();
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    if (!token) {
      setLikedSongs([]);
      return;
    }
    startLoading();
    getProfile()
      .then((profile) => setLikedSongs(profile?.likedSongs || []))
      .catch(() => undefined)
      .finally(stopLoading);
  }, [token, startLoading, stopLoading]);

  if (!token) {
    return (
      <div className="px-4 sm:px-6 lg:px-10 pb-36">
        <div className="glass rounded-3xl p-8 text-center text-white/70">
          Login to see your liked songs.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-36">
      <div className="glass rounded-3xl p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Favorites</p>
        <h2 className="text-2xl md:text-3xl font-semibold mt-2">Your liked songs</h2>
        <div className="mt-6 grid gap-4">
          {likedSongs.length === 0 && (
            <div className="glass rounded-2xl p-6 text-center text-white/60">
              No liked songs yet. Tap the heart to save tracks.
            </div>
          )}
          {likedSongs.map((song) => (
            <SongCard
              key={song.songId}
              song={song}
              list={likedSongs}
              playIcon
              likeIcon
              onLike={async () => {
                try {
                  await toggleLike(song);
                  setLikedSongs((prev) => prev.filter((s) => s.songId !== song.songId));
                  showToast({ type: "success", message: "Removed from favorites." });
                } catch {
                  showToast({ type: "error", message: "Unable to remove song." });
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
