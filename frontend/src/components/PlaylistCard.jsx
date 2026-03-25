import React from "react";
import { useNavigate } from "react-router-dom";

const PlaylistCard = ({ playlist, onOpen, to, onDelete }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (to) {
      navigate(to);
      return;
    }
    if (onOpen) onOpen();
  };

  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-4 text-left hover:bg-white/5 relative">
      <button type="button" onClick={handleClick} className="text-left">
        <div>
          <p className="text-lg font-semibold">{playlist.name}</p>
          <p className="text-xs text-white/60">{playlist.songs?.length || 0} tracks</p>
        </div>
        <span className="mt-4 inline-flex px-3 py-2 rounded-full text-xs uppercase tracking-[0.2em] border border-white/10 text-white/70">
          Open
        </span>
      </button>
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-3 right-3 h-8 w-8 rounded-full border border-rose-400/40 text-rose-200 hover:border-rose-300 hover:text-rose-100 flex items-center justify-center"
          aria-label="Delete playlist"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default PlaylistCard;
