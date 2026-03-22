import React from "react";
import { motion } from "framer-motion";
import { usePlayer } from "../context/PlayerContext.jsx";

const SongCard = ({ song, onLike, onAdd, list }) => {
  const { setCurrentTrack } = usePlayer();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass rounded-2xl p-4 flex gap-4 items-center"
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
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-2 rounded-full text-xs uppercase tracking-[0.2em] border border-white/10 text-white/70 hover:text-white"
          onClick={() => setCurrentTrack(song, list)}
        >
          Play
        </button>
        {onAdd && (
          <button
            className="px-3 py-2 rounded-full text-xs uppercase tracking-[0.2em] border border-white/10 text-white/70 hover:text-white"
            onClick={() => onAdd(song)}
          >
            Add
          </button>
        )}
        {onLike && (
          <button
            className="px-3 py-2 rounded-full text-xs uppercase tracking-[0.2em] border border-white/10 text-white/70 hover:text-white"
            onClick={() => onLike(song)}
          >
            Like
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SongCard;