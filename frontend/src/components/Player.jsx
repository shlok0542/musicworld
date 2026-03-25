import React, { useEffect, useMemo, useState } from "react";
import { usePlayer } from "../context/PlayerContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { addHistory, toggleLike } from "../services/userService.js";
import { fetchPlaylists, addSongToPlaylist } from "../services/playlistService.js";
import { searchSongs } from "../services/musicService.js";
import { normalizeSong } from "../utils/normalizeSong.js";

const formatTime = (value) => {
  if (!value || Number.isNaN(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const IconButton = ({ label, onClick, active, children }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className={`h-9 w-9 rounded-full flex items-center justify-center border transition ${
      active ? "border-emerald-300 text-emerald-200" : "border-white/10 text-white/70"
    } hover:text-white hover:border-white/30 bg-white/5`}
  >
    {children}
  </button>
);

const Player = () => {
  const {
    audioRef,
    currentTrack,
    currentIndex,
    isPlaying,
    volume,
    progress,
    duration,
    shuffle,
    repeatMode,
    queue,
    setQueue,
    setCurrentIndex,
    quality,
    dataSaver,
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
  const { token } = useAuth();
  const { showToast } = useUI();

  const [muted, setMuted] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [radioLabel, setRadioLabel] = useState("");

  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;
    const desiredQuality = dataSaver ? "64kbps" : quality;
    const source =
      currentTrack.downloads?.find((d) => d.quality === desiredQuality)?.url ||
      currentTrack.url ||
      "";
    audioRef.current.src = source;
    audioRef.current.load();
    setProgress(0);
    setDuration(0);
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
      if (token) {
        addHistory(currentTrack).catch(() => undefined);
      }
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

  const onEnded = async () => {
    if (repeatMode === "one" && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setIsPlaying(false));
      return;
    }
    const atEnd = currentIndex >= queue.length - 1;
    if (repeatMode === "off" && (queue.length <= 1 || atEnd)) {
      if (loadingRelated) return;
      setLoadingRelated(true);
      try {
        const query = currentTrack?.artist || currentTrack?.title || "";
        if (query) {
          const data = await searchSongs(query, 1);
          const list = Array.isArray(data) ? data : data?.results || [];
          const related = list.map(normalizeSong).filter((s) => s.songId !== currentTrack.songId);
          if (related.length > 0) {
            const randomIndex = Math.floor(Math.random() * related.length);
            setQueue(related);
            setCurrentIndex(randomIndex);
            setIsPlaying(true);
            setRadioLabel("Related Radio");
            return;
          }
        }
      } catch {
        undefined;
      } finally {
        setLoadingRelated(false);
      }
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

  const handleLike = async () => {
    if (!currentTrack) return;
    if (!token) {
      showToast({ type: "error", message: "Login to like songs." });
      return;
    }
    try {
      await toggleLike(currentTrack);
      showToast({ type: "success", message: "Liked song." });
    } catch {
      showToast({ type: "error", message: "Unable to like song." });
    }
  };

  const handleOpenAdd = async () => {
    if (!token) {
      showToast({ type: "error", message: "Login to add to playlist." });
      return;
    }
    try {
      const list = await fetchPlaylists();
      setPlaylists(list);
      setShowAdd((prev) => !prev);
    } catch {
      showToast({ type: "error", message: "Unable to load playlists." });
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    if (!currentTrack) return;
    try {
      await addSongToPlaylist(playlistId, currentTrack);
      showToast({ type: "success", message: "Added to playlist." });
      setShowAdd(false);
    } catch {
      showToast({ type: "error", message: "Failed to add song." });
    }
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

  if (!currentTrack) {
    return null;
  }

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
                {radioLabel && (
                  <span className="mt-1 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-emerald-300">
                    {radioLabel}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <IconButton
                  label="Shuffle"
                  onClick={() => setShuffle(!shuffle)}
                  active={shuffle}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 3h5v5" />
                    <path d="M4 20l5-5" />
                    <path d="M4 4l6 6" />
                    <path d="M21 3l-5 5" />
                    <path d="M21 16v5h-5" />
                    <path d="M15 15l6 6" />
                  </svg>
                </IconButton>
                <IconButton label="Previous" onClick={handlePrev}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M6 5h2v14H6zM18.5 5l-9.5 7 9.5 7V5z" />
                  </svg>
                </IconButton>
                <button
                  type="button"
                  aria-label={isPlaying ? "Pause" : "Play"}
                  onClick={togglePlay}
                  className="h-11 w-11 rounded-full flex items-center justify-center bg-emerald-400 text-slate-900 shadow-glow"
                >
                  {isPlaying ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M7 5v14l12-7z" />
                    </svg>
                  )}
                </button>
                <IconButton label="Next" onClick={handleNext}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M16 5h2v14h-2zM5.5 5l9.5 7-9.5 7V5z" />
                  </svg>
                </IconButton>
                <IconButton
                  label="Repeat"
                  onClick={cycleRepeat}
                  active={repeatMode !== "off"}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 1l4 4-4 4" />
                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                    <path d="M7 23l-4-4 4-4" />
                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                  </svg>
                </IconButton>
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

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 relative">
              <IconButton label="Like" onClick={handleLike}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                </svg>
              </IconButton>
              <div className="relative">
                <IconButton label="Add to playlist" onClick={handleOpenAdd}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </IconButton>
                {showAdd && (
                  <div className="absolute right-0 mt-2 w-48 glass rounded-2xl p-2 shadow-glass z-50">
                    {playlists.length === 0 && (
                      <div className="px-3 py-2 text-xs text-white/60">No playlists found.</div>
                    )}
                    {playlists.map((pl) => (
                      <button
                        key={pl._id}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/80 hover:bg-white/10"
                        onClick={() => handleAddToPlaylist(pl._id)}
                      >
                        {pl.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <IconButton label={muted ? "Unmute" : "Mute"} onClick={() => setMuted((prev) => !prev)} active={muted}>
                {muted ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M16.5 12L19 14.5 17.5 16l-2.5-2.5-2.5 2.5L11 14.5 13.5 12 11 9.5 12.5 8l2.5 2.5L17.5 8 19 9.5z" />
                    <path d="M11 5L6 9H3v6h3l5 4V5z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M11 5L6 9H3v6h3l5 4V5z" />
                    <path d="M15 9a4 4 0 0 1 0 6" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                )}
              </IconButton>
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
