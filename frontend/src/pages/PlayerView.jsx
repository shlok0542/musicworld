import React from "react";
import { usePlayer } from "../context/PlayerContext.jsx";

const PlayerView = () => {
  const { currentTrack, queue, setCurrentTrack } = usePlayer();

  return (
    <div className="px-6 pb-32">
      <div className="glass rounded-[40px] p-8 md:p-10 grid lg:grid-cols-[1fr_1.1fr] gap-8 items-center">
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={
                currentTrack?.image ||
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&auto=format"
              }
              alt="album"
              className="h-60 w-60 md:h-80 md:w-80 rounded-full object-cover border border-white/20 shadow-glow animate-spin-slow"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400/30 to-cyan-400/10 blur-3xl" />
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Now Spinning</p>
          <h2 className="text-3xl md:text-5xl font-semibold mt-3">
            {currentTrack?.title || "Choose a track to ignite the room"}
          </h2>
          <p className="text-white/70 mt-2">{currentTrack?.artist || "Your soundscape awaits"}</p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {[
              { label: "Genre", value: "Synthwave" },
              { label: "Mood", value: "Night Drive" },
              { label: "Energy", value: "Flow" },
              { label: "Room", value: "Deep Focus" }
            ].map((item) => (
              <div key={item.label} className="glass rounded-2xl p-4">
                <p className="text-xs text-white/50 uppercase tracking-[0.3em]">{item.label}</p>
                <p className="text-lg font-semibold mt-2">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 glass rounded-3xl p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Queue</p>
            <h3 className="text-xl font-semibold mt-2">Up next</h3>
          </div>
          <p className="text-xs text-white/50">{queue.length} tracks</p>
        </div>
        <div className="mt-4 space-y-3">
          {queue.length === 0 && (
            <div className="glass rounded-2xl p-4 text-sm text-white/60">
              Start a song from Search or Home to build your queue.
            </div>
          )}
          {queue.map((song) => (
            <button
              key={song.songId}
              onClick={() => setCurrentTrack(song, queue)}
              className="w-full flex items-center gap-4 rounded-2xl px-4 py-3 hover:bg-white/5"
            >
              <img src={song.image} alt={song.title} className="h-12 w-12 rounded-xl object-cover" />
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-white truncate">{song.title}</p>
                <p className="text-xs text-white/60 truncate">{song.artist}</p>
              </div>
              <span className="text-[10px] text-white/40 uppercase tracking-[0.3em]">Play</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerView;