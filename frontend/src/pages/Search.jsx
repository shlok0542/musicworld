import React, { useState } from "react";
import SongCard from "../components/SongCard.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import { searchSongs } from "../services/musicService.js";
import { toggleLike } from "../services/userService.js";
import { normalizeSong } from "../utils/normalizeSong.js";
import { useUI } from "../context/UIContext.jsx";

const chipStyles = "px-3 py-2 rounded-full text-xs uppercase tracking-[0.2em] border border-white/10 text-white/60 hover:text-white";

const Search = () => {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast, startLoading, stopLoading } = useUI();

  const runSearch = async (value) => {
    if (!value.trim()) return;
    setLoading(true);
    setError("");
    startLoading();
    try {
      const data = await searchSongs(value.trim());
      const list = Array.isArray(data) ? data : data?.results || [];
      setSongs(list.map(normalizeSong));
    } catch (err) {
      setError("Search failed. Try again in a moment.");
      showToast({ type: "error", message: "Search failed." });
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  const quickSearch = (value) => {
    setQuery(value);
    runSearch(value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    runSearch(query);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-36">
      <div className="glass rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Search</p>
            <h2 className="text-2xl md:text-3xl font-semibold mt-2">Find your next obsession.</h2>
            <p className="text-white/70 mt-1 text-sm">Search songs, artists, or moods in seconds.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Workout", "Chill", "Love", "Party"].map((tag) => (
              <button key={tag} className={chipStyles} onClick={() => quickSearch(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSearch} className="mt-6 flex flex-col md:flex-row gap-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, artists, moods"
            className="flex-1 bg-transparent outline-none text-lg border border-white/10 rounded-2xl px-4 py-3"
          />
          <button className="px-5 py-3 rounded-full bg-emerald-400 text-slate-900 font-semibold">
            Search
          </button>
        </form>
      </div>

      {error && <p className="text-sm text-rose-300 mt-4">{error}</p>}

      <div className="mt-6 grid gap-4">
        {loading && Array.from({ length: 4 }).map((_, idx) => <LoadingSkeleton key={idx} />)}
        {!loading && songs.length === 0 && (
          <div className="glass rounded-2xl p-6 text-center text-white/60">
            Start searching to see results here.
          </div>
        )}
        {!loading &&
          songs.map((song) => (
            <SongCard
              key={song.songId}
              song={song}
              list={songs}
              onLike={async () => {
                try {
                  await toggleLike(song);
                  showToast({ type: "success", message: "Saved to likes." });
                } catch {
                  showToast({ type: "error", message: "Login to like songs." });
                }
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default Search;