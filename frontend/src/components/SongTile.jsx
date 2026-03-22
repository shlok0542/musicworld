import React from "react";
import { motion } from "framer-motion";
import { usePlayer } from "../context/PlayerContext.jsx";

const SongTile = ({ song, list }) => {
  const { setCurrentTrack } = usePlayer();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-3 min-w-[180px] max-w-[200px] flex flex-col gap-3"
    >
      <img
        src={song.image}
        alt={song.title}
        className="h-36 w-full rounded-xl object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{song.title}</p>
        <p className="text-xs text-white/60 truncate">{song.artist}</p>
      </div>
      <button
        className="px-3 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] bg-emerald-400 text-slate-900 font-semibold"
        onClick={() => setCurrentTrack(song, list)}
      >
        Play
      </button>
    </motion.div>
  );
};

export default SongTile;