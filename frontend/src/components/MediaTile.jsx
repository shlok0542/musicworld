import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePlayer } from "../context/PlayerContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const MediaTile = ({ item, list, type = "song", onOpen }) => {
  const { setCurrentTrack } = usePlayer();
  const { showToast } = useUI();
  const { user, token } = useAuth();
  const canPlay = type === "song" && item.url;
  const canSavePlaylist = type === "playlist";
  const storageKey = useMemo(
    () => (user?._id ? `mw-saved-playlists-${user._id}` : null),
    [user?._id]
  );
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!storageKey) {
      setIsSaved(false);
      return;
    }
    const raw = localStorage.getItem(storageKey);
    const saved = raw ? JSON.parse(raw) : [];
    setIsSaved(saved.some((pl) => pl.id === item.id));
  }, [storageKey, item.id]);

  const handleSaveToggle = (e) => {
    e.stopPropagation();
    if (!user || !token) {
      showToast({ type: "error", message: "Login to save playlists." });
      return;
    }
    const raw = localStorage.getItem(storageKey);
    const saved = raw ? JSON.parse(raw) : [];
    const exists = saved.some((pl) => pl.id === item.id);
    let next = saved;
    if (exists) {
      next = saved.filter((pl) => pl.id !== item.id);
      showToast({ type: "success", message: "Removed from Library." });
    } else {
      const payload = {
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        image: item.image,
        type: "playlist"
      };
      next = [payload, ...saved].slice(0, 50);
      showToast({ type: "success", message: "Saved to Library." });
    }
    localStorage.setItem(storageKey, JSON.stringify(next));
    setIsSaved(!exists);
    window.dispatchEvent(new Event("mw-saved-playlists-changed"));
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-3 min-w-[150px] sm:min-w-[180px] max-w-[200px] flex flex-col gap-3 relative"
    >
      {canSavePlaylist && (
        <button
          type="button"
          onClick={handleSaveToggle}
          className="absolute top-3 right-3 h-8 w-8 rounded-full border border-white/20 bg-slate-950/90 text-white/80 flex items-center justify-center hover:text-white hover:border-white/40"
          aria-label={isSaved ? "Remove playlist" : "Save playlist"}
        >
          {isSaved ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          )}
        </button>
      )}
      <img src={item.image} alt={item.title} className="h-32 sm:h-36 w-full rounded-xl object-cover" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{item.title}</p>
        <p className="text-xs text-white/60 truncate">{item.subtitle}</p>
      </div>
      {canPlay ? (
        <button
          className="px-3 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] bg-emerald-400 text-slate-900 font-semibold"
          onClick={() => setCurrentTrack(item, list)}
        >
          Play
        </button>
      ) : (
        <button
          className="px-3 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] border border-white/10 text-white/70"
          onClick={onOpen}
        >
          Open
        </button>
      )}
    </motion.div>
  );
};

export default MediaTile;
