import React, { useEffect, useMemo, useState } from "react";
import { usePlayer } from "../context/PlayerContext.jsx";
import { addHistory } from "../services/userService.js";

const formatTime = (value) => {
  if (!value || Number.isNaN(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const Player = () => {
  const {
    audioRef,
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    shuffle,
    repeatMode,
    queue,
    setIsPlaying,
    setProgress,
    setDuration,
    setVolume,
    setShuffle,
    cycleRepeat,
    togglePlay,
    next,
    prev
  } = usePlayer();

  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;
    audioRef.current.src = currentTrack.url || "";
    audioRef.current.load();
    setProgress(0);
    setDuration(0);
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
      addHistory(currentTrack).catch(() => undefined);
    }
  }, [currentTrack]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.muted = muted;
  }, [volume, muted]);

  const onTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const onSeek = (e) => {
    if (!audioRef.current) return;
    const value = Number(e.target.value);
    audioRef.current.currentTime = value;
    setProgress(value);
  };

  const onLoaded = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || 0);
  };

  const onEnded = () => {
    if (repeatMode === "one" && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setIsPlaying(false));
      return;
    }
    next();
  };

  const handlePrev = () => {
    if (queue.length <= 1 && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
      return;
    }
    prev();
  };

  const handleNext = () => {
    if (queue.length <= 1 && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
      return;
    }
    next();
  };

  const cover =
    currentTrack?.image ||
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80&auto=format";

  const shimmer = useMemo(
    () => ({
      backgroundImage:
        "linear-gradient(120deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.15) 80%)"
    }),
    []
  );

  const repeatLabel = repeatMode === "off" ? "Repeat Off" : repeatMode === "all" ? "Repeat All" : "Repeat One";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      <div className="glass border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-3">
          <div className="grid gap-3 md:gap-4 md:grid-cols-[1.2fr_1.6fr_1.2fr] items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={cover}
                  alt="cover"
                  className="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover border border-white/20"
                />
                <div className="absolute -inset-2 rounded-full opacity-30 blur-xl" style={shimmer} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {currentTrack?.title || "Pick a track"}
                </p>
                <p className="text-xs text-white/60 truncate">
                  {currentTrack?.artist || "Let the vibe guide you"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  className={`px-3 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] border ${
                    shuffle ? "border-emerald-300 text-emerald-200" : "border-white/10 text-white/60"
                  }`}
                  onClick={() => setShuffle(!shuffle)}
                >
                  Shuffle
                </button>
                <button
                  className="px-3 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] border border-white/10 text-white/70"
                  onClick={handlePrev}
                >
                  Prev
                </button>
                <button
                  className="px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] bg-emerald-400 text-slate-900 font-semibold"
                  onClick={togglePlay}
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <button
                  className="px-3 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] border border-white/10 text-white/70"
                  onClick={handleNext}
                >
                  Next
                </button>
                <button
                  className={`px-3 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] border ${
                    repeatMode !== "off" ? "border-emerald-300 text-emerald-200" : "border-white/10 text-white/60"
                  }`}
                  onClick={cycleRepeat}
                >
                  {repeatLabel}
                </button>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-white/50">
                <span className="w-10 text-right">{formatTime(progress)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={progress}
                  onChange={onSeek}
                  className="w-full accent-emerald-400"
                />
                <span className="w-10">{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
              <div className="flex items-center gap-2 text-xs text-white/60">
                <span>Vol</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="accent-emerald-400"
                />
              </div>
              <button
                className={`px-3 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] border ${
                  muted ? "border-emerald-300 text-emerald-200" : "border-white/10 text-white/60"
                }`}
                onClick={() => setMuted((prev) => !prev)}
              >
                {muted ? "Muted" : "Mute"}
              </button>
              <div className="text-[10px] text-white/40 uppercase tracking-[0.3em]">
                Queue {queue.length}
              </div>
            </div>
          </div>

          <audio
            ref={audioRef}
            preload="metadata"
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={onLoaded}
            onEnded={onEnded}
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
