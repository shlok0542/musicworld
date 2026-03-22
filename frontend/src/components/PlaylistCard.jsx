import React from "react";

const PlaylistCard = ({ playlist, onOpen }) => (
  <div className="glass rounded-2xl p-4 flex flex-col gap-4">
    <div>
      <p className="text-lg font-semibold">{playlist.name}</p>
      <p className="text-xs text-white/60">{playlist.songs?.length || 0} tracks</p>
    </div>
    <button
      className="px-3 py-2 rounded-full text-xs uppercase tracking-[0.2em] border border-white/10 text-white/70 hover:text-white"
      onClick={onOpen}
    >
      Open
    </button>
  </div>
);

export default PlaylistCard;
