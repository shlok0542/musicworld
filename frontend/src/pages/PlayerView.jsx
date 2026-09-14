import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePlayer } from "../context/PlayerContext.jsx";

const formatTime = (value) => {
  if (!value || Number.isNaN(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const PlayerIconButton = ({ label, onClick, children, className = "" }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className={`flex h-12 w-12 items-center justify-center text-white transition hover:text-violet-300 ${className}`}
  >
    {children}
  </button>
);

const PlayerView = () => {
  const {
    audioRef,
    currentTrack,
    queue,
    progress,
    duration,
    isPlaying,
    shuffle,
    repeatMode,
    setProgress,
    setShuffle,
    setIsPlaying,
    setCurrentTrack,
    cycleRepeat,
    togglePlay,
    next,
    prev
  } = usePlayer();
  const [showAllQueue, setShowAllQueue] = React.useState(false);

  const cover = currentTrack?.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&auto=format";

  const handleSeek = (event) => {
    const value = Number(event.target.value);
    if (audioRef.current) audioRef.current.currentTime = value;
    setProgress(value);
  };

  const handlePrevious = () => {
    if (queue.length <= 1 && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => undefined);
      setIsPlaying(true);
      return;
    }
    prev();
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#080708] text-white">
      <div className="mx-auto max-w-md px-6 pb-28 pt-4 md:hidden">
        <div className="flex items-center justify-between">
          <button type="button" aria-label="Close player" onClick={() => window.history.back()} className="p-2 text-white hover:text-violet-300">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m5 9 7 7 7-7" />
            </svg>
          </button>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">Now playing</p>
          <span className="w-10" aria-hidden="true" />
        </div>

        <div className="mt-9 flex justify-center">
          <img src={cover} alt="album cover" className="aspect-square w-full max-w-[19rem] rounded-xl object-cover shadow-[0_18px_70px_rgba(123,47,247,0.2)]" />
        </div>

        <div className="mt-8 min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight">{currentTrack?.title || "Choose a track"}</h1>
          <p className="mt-2 truncate text-base text-white/65">{currentTrack?.artist || "Your soundscape awaits"}</p>
        </div>

        <div className="mt-8">
          <input type="range" min="0" max={duration || 0} value={progress} onChange={handleSeek} className="w-full accent-emerald-400" />
          <div className="mt-1 flex justify-between text-xs text-white/55">
            <span>{formatTime(progress)}</span><span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between">
          <PlayerIconButton label="Shuffle" onClick={() => setShuffle(!shuffle)} className={shuffle ? "text-violet-300" : "text-white/75"}>
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5M4 20l5-5M4 4l6 6M21 3l-5 5M21 16v5h-5M15 15l6 6" /></svg>
          </PlayerIconButton>
          <PlayerIconButton label="Previous" onClick={prev}>
            <svg viewBox="0 0 24 24" className="h-9 w-9" fill="currentColor"><path d="M6 5h2v14H6zM18.5 5l-9.5 7 9.5 7V5z" /></svg>
          </PlayerIconButton>
          <button type="button" aria-label={isPlaying ? "Pause" : "Play"} onClick={togglePlay} className="flex h-[5.6rem] w-[5.6rem] items-center justify-center rounded-full bg-white text-[#0b0a12] shadow-[0_10px_35px_rgba(255,255,255,0.15)]">
            {isPlaying ? <svg viewBox="0 0 24 24" className="h-9 w-9" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg> : <svg viewBox="0 0 24 24" className="h-9 w-9" fill="currentColor"><path d="M7 5v14l12-7z" /></svg>}
          </button>
          <PlayerIconButton label="Next" onClick={next}>
            <svg viewBox="0 0 24 24" className="h-9 w-9" fill="currentColor"><path d="M16 5h2v14h-2zM5.5 5l9.5 7-9.5 7V5z" /></svg>
          </PlayerIconButton>
          <PlayerIconButton label="Repeat" onClick={cycleRepeat} className={repeatMode !== "off" ? "text-violet-300" : "text-white/75"}>
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" /></svg>
          </PlayerIconButton>
        </div>

        <div className="mt-14 flex items-center justify-between border-b border-white/10 pb-3 text-sm font-semibold">
          <span className="border-b-2 border-violet-400 pb-3 text-white">Up next</span>
        </div>

        <motion.div layout className="mt-4 space-y-2">
          <AnimatePresence initial={false}>
            {queue.slice(0, showAllQueue ? queue.length : 10).map((song) => (
              <motion.button
                key={song.songId}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                onClick={() => setCurrentTrack(song, queue)}
                className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-white/5"
              >
                <img src={song.image} alt="" className="h-11 w-11 rounded-lg object-cover" />
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{song.title}</span><span className="block truncate text-xs text-white/55">{song.artist}</span></span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
        {queue.length > 10 && (
          <button type="button" onClick={() => setShowAllQueue((previous) => !previous)} className="mt-3 text-sm font-semibold text-violet-300 hover:text-violet-200">
            {showAllQueue ? "Show less" : `See more (${queue.length - 10})`}
          </button>
        )}
      </div>

      <div className="hidden min-h-[calc(100vh-5rem)] px-8 pb-24 pt-8 md:block">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <button type="button" aria-label="Close player" onClick={() => window.history.back()} className="p-2 text-white hover:text-violet-300">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 9 7 7 7-7" /></svg>
            </button>
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Now playing</p>
            <span className="w-10" aria-hidden="true" />
          </div>

          <div className="mt-8 grid items-center gap-12 lg:grid-cols-[minmax(20rem,28rem)_1fr]">
            <img src={cover} alt="album cover" className="mx-auto aspect-square w-full max-w-[28rem] rounded-2xl object-cover shadow-[0_18px_70px_rgba(123,47,247,0.2)]" />
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Now playing</p>
              <h1 className="mt-3 break-words text-4xl font-bold tracking-tight xl:text-5xl">{currentTrack?.title || "Choose a track"}</h1>
              <p className="mt-3 break-words text-lg text-white/65">{currentTrack?.artist || "Your soundscape awaits"}</p>

              <div className="mt-10">
                <input type="range" min="0" max={duration || 0} step="0.1" value={progress} onChange={handleSeek} onInput={handleSeek} className="w-full accent-emerald-400" />
                <div className="mt-2 flex justify-between text-sm text-white/55"><span>{formatTime(progress)}</span><span>{formatTime(duration)}</span></div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <PlayerIconButton label="Shuffle" onClick={() => setShuffle(!shuffle)} className={shuffle ? "text-violet-300" : "text-white/75"}>
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5M4 20l5-5M4 4l6 6M21 3l-5 5M21 16v5h-5M15 15l6 6" /></svg>
                </PlayerIconButton>
                <PlayerIconButton label="Previous" onClick={handlePrevious}>
                  <svg viewBox="0 0 24 24" className="h-9 w-9" fill="currentColor"><path d="M6 5h2v14H6zM18.5 5l-9.5 7 9.5 7V5z" /></svg>
                </PlayerIconButton>
                <button type="button" aria-label={isPlaying ? "Pause" : "Play"} onClick={togglePlay} className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#0b0a12] shadow-[0_10px_35px_rgba(255,255,255,0.15)]">
                  {isPlaying ? <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg> : <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><path d="M7 5v14l12-7z" /></svg>}
                </button>
                <PlayerIconButton label="Next" onClick={next}>
                  <svg viewBox="0 0 24 24" className="h-9 w-9" fill="currentColor"><path d="M16 5h2v14h-2zM5.5 5l9.5 7-9.5 7V5z" /></svg>
                </PlayerIconButton>
                <PlayerIconButton label="Repeat" onClick={cycleRepeat} className={repeatMode !== "off" ? "text-violet-300" : "text-white/75"}>
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" /></svg>
                </PlayerIconButton>
              </div>
            </div>
          </div>

          <div className="mt-14 flex max-w-xl items-center justify-between border-b border-white/10 pb-3 text-sm font-semibold">
            <span className="border-b-2 border-violet-400 pb-3 text-white">Up next</span>
          </div>
          <motion.div layout className="mt-4 max-w-xl space-y-2">
            <AnimatePresence initial={false}>
              {queue.slice(0, showAllQueue ? queue.length : 10).map((song) => (
                <motion.button
                  key={song.songId}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setCurrentTrack(song, queue)}
                  className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-white/5"
                >
                  <img src={song.image} alt="" className="h-11 w-11 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{song.title}</span><span className="block truncate text-xs text-white/55">{song.artist}</span></span>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
          {queue.length > 10 && (
            <button type="button" onClick={() => setShowAllQueue((previous) => !previous)} className="mt-3 text-sm font-semibold text-violet-300 hover:text-violet-200">
              {showAllQueue ? "Show less" : `See more (${queue.length - 10})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerView;
