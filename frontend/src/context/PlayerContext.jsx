import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");

  const currentTrack = currentIndex >= 0 ? queue[currentIndex] : null;
  const [quality, setQuality] = useState("320kbps");
  const [dataSaver, setDataSaver] = useState(false);

  const setCurrentTrack = (track, list = []) => {
    if (!track) return;
    if (list.length > 0) {
      setQueue(list);
      const index = list.findIndex((t) => t.songId === track.songId);
      setCurrentIndex(index >= 0 ? index : 0);
    } else {
      setQueue([track]);
      setCurrentIndex(0);
    }
    setIsPlaying(true);
  };

  const pickRandomIndex = () => {
    if (queue.length <= 1) return currentIndex;
    let nextIndex = currentIndex;
    while (nextIndex === currentIndex) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }
    return nextIndex;
  };

  const next = () => {
    if (queue.length === 0) return;
    if (shuffle) {
      setCurrentIndex(pickRandomIndex());
      setIsPlaying(true);
      return;
    }
    const atEnd = currentIndex + 1 >= queue.length;
    if (atEnd && repeatMode !== "all") {
      setIsPlaying(false);
      return;
    }
    setCurrentIndex(atEnd ? 0 : currentIndex + 1);
    setIsPlaying(true);
  };

  const prev = () => {
    if (queue.length === 0) return;
    if (shuffle) {
      setCurrentIndex(pickRandomIndex());
      setIsPlaying(true);
      return;
    }
    const atStart = currentIndex - 1 < 0;
    if (atStart && repeatMode !== "all") {
      setIsPlaying(false);
      return;
    }
    setCurrentIndex(atStart ? queue.length - 1 : currentIndex - 1);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    setIsPlaying((prev) => !prev);
  };

  const cycleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("mw-user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.settings?.quality) setQuality(parsed.settings.quality);
        if (typeof parsed?.settings?.dataSaver === "boolean") setDataSaver(parsed.settings.dataSaver);
        return;
      } catch {
        undefined;
      }
    }
    const storedQuality = localStorage.getItem("mw-audio-quality");
    const storedSaver = localStorage.getItem("mw-data-saver");
    if (storedQuality) setQuality(storedQuality);
    if (storedSaver) setDataSaver(storedSaver === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("mw-audio-quality", quality);
  }, [quality]);

  useEffect(() => {
    localStorage.setItem("mw-data-saver", String(dataSaver));
  }, [dataSaver]);

  const value = useMemo(
    () => ({
      audioRef,
      queue,
      currentIndex,
      currentTrack,
      isPlaying,
      volume,
      progress,
      duration,
      shuffle,
      repeatMode,
      quality,
      dataSaver,
      setQueue,
      setCurrentIndex,
      setCurrentTrack,
      setIsPlaying,
      setVolume,
      setProgress,
      setDuration,
      setShuffle,
      setRepeatMode,
      setQuality,
      setDataSaver,
      togglePlay,
      cycleRepeat,
      next,
      prev
    }),
    [
      queue,
      currentIndex,
      currentTrack,
      isPlaying,
      volume,
      progress,
      duration,
      shuffle,
      repeatMode,
      quality,
      dataSaver
    ]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
};
