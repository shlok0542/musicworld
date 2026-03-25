import React from "react";
import { motion } from "framer-motion";
import { usePlayer } from "../context/PlayerContext.jsx";

const SongCard = ({ song, onLike, onAdd, list, playIcon = false, likeIcon = false, addIcon = false }) => {
  const { setCurrentTrack } = usePlayer();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
    >
      <img
        src={song.image}
        alt={song.title}
        className="h-16 w-16 rounded-2xl object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white truncate">{song.title}</p>
        <p className="text-xs text-white/60 truncate">{song.artist}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          className="px-3 py-2 rounded-full text-xs uppercase tracking-[0.2em] border border-white/10 text-white/70 hover:text-white flex items-center justify-center"
          onClick={() => setCurrentTrack(song, list)}
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
        {onLike && (
          <button
            className="px-3 py-2 rounded-full text-xs uppercase tracking-[0.2em] border border-white/10 text-white/70 hover:text-white"
            onClick={() => onLike(song)}
          >
            {likeIcon ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
              </svg>
            ) : (
              "Like"
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SongCard;
