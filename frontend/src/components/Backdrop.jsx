import React from "react";
import { usePlayer } from "../context/PlayerContext.jsx";

const Backdrop = () => {
  const { currentTrack } = usePlayer();
  const image = currentTrack?.image || "";

  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 grid-noise" />
      {image ? (
        <div
          className="absolute inset-0 bg-center bg-cover blur-3xl opacity-40 scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-indigo-500/10 to-emerald-500/10" />
      )}
      <div className="absolute inset-0 bg-slate-950/70" />
    </div>
  );
};

export default Backdrop;
