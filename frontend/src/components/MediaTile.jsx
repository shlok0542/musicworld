import React from "react";
import { motion } from "framer-motion";
import { usePlayer } from "../context/PlayerContext.jsx";

const MediaTile = ({ item, list, type = "song", onOpen }) => {
  const { setCurrentTrack } = usePlayer();
  const canPlay = type === "song" && item.url;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-3 min-w-[150px] sm:min-w-[180px] max-w-[200px] flex flex-col gap-3"
    >
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