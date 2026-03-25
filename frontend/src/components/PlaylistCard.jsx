import React from "react";
import { useNavigate } from "react-router-dom";

const PlaylistCard = ({ playlist, onOpen, to }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (to) {
      navigate(to);
      return;
    }
    if (onOpen) onOpen();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="glass rounded-2xl p-4 flex flex-col gap-4 text-left hover:bg-white/5"
    >
      <div>
        <p className="text-lg font-semibold">{playlist.name}</p>
        <p className="text-xs text-white/60">{playlist.songs?.length || 0} tracks</p>
      </div>
      <span className="px-3 py-2 rounded-full text-xs uppercase tracking-[0.2em] border border-white/10 text-white/70">
        Open
      </span>
    </button>
  );
};

export default PlaylistCard;