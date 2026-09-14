import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePlayer } from "../context/PlayerContext.jsx";

const SongCard = ({ song, onLike, onDelete, onAdd, list, playIcon = false, likeIcon = false, addIcon = false }) => {
  const { setCurrentTrack } = usePlayer();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  const playSong = () => {
    setCurrentTrack(song, list);
    setMenuOpen(false);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={(event) => {
        if (!event.target.closest("button")) playSong();
      }}
      className={`glass relative w-full min-w-0 max-w-full overflow-visible rounded-2xl p-3 sm:p-4 flex flex-row gap-3 sm:gap-4 items-center ${
        menuOpen ? "z-30" : "z-0"
      } cursor-pointer`}
    >
      <img
        src={song.image}
        alt={song.title}
        className="h-16 w-16 shrink-0 rounded-2xl object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white truncate">{song.title}</p>
        <p className="text-xs text-white/60 truncate">{song.artist}</p>
      </div>
      <div className="relative shrink-0" ref={menuRef}>
        {onLike ? (
          <>
            <button
              type="button"
              aria-label="More song options"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((previous) => !previous)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <circle cx="12" cy="5" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="12" cy="19" r="1.7" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl border border-white/10 bg-[#17151f] p-1 shadow-glass">
                <button type="button" onClick={playSong} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10">Play song</button>
                <button type="button" onClick={() => { onLike(song); setMenuOpen(false); }} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-200 hover:bg-rose-500/10">Remove from favorites</button>
              </div>
            )}
          </>
        ) : onDelete ? (
          <button
            type="button"
            aria-label="Delete from history"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(song);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-rose-500/10 hover:text-rose-200"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
            </svg>
          </button>
        ) : (
          <button
            className="px-3 py-2 rounded-full text-xs uppercase tracking-[0.2em] border border-white/10 text-white/70 hover:text-white flex items-center justify-center"
            onClick={playSong}
            aria-label="Play"
          >
            {playIcon ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M7 5v14l12-7z" />
              </svg>
            ) : (
              "Play"
            )}
          </button>
        )}
        {onAdd && (
          <button
            className="px-3 py-2 rounded-full text-xs uppercase tracking-[0.2em] border border-white/10 text-white/70 hover:text-white"
            onClick={() => onAdd(song)}
          >
            {addIcon ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            ) : (
              "Add"
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SongCard;
