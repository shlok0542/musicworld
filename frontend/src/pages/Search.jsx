import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SongCard from "../components/SongCard.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import MediaTile from "../components/MediaTile.jsx";
import {
  searchSongs,
  searchAlbums,
  searchPlaylists,
  searchArtists,
  searchGlobal
} from "../services/musicService.js";
import {
  normalizeSong,
  normalizeAlbum,
  normalizePlaylist,
  normalizeArtist,
  normalizeGlobal
} from "../utils/normalizeSong.js";
import { useUI } from "../context/UIContext.jsx";
import { toggleLike } from "../services/userService.js";
import { useAuth } from "../context/AuthContext.jsx";

const chipStyles = "px-3 py-2 rounded-full text-xs uppercase tracking-[0.2em] border border-white/10 text-white/60 hover:text-white";

const filters = [
  { key: "songs", label: "Songs" },
  { key: "albums", label: "Albums" },
  { key: "playlists", label: "Playlists" },
  { key: "artists", label: "Artists" },
  { key: "global", label: "Global" }
];

const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("songs");
  const [page, setPage] = useState(1);
  const [recent, setRecent] = useState([]);
  const { user, token } = useAuth();
  const { showToast, startLoading, stopLoading } = useUI();

  const historyKey = user?.id ? `mw-search-history-${user.id}` : null;

  useEffect(() => {
    if (!token || !historyKey) {
      setRecent([]);
      return;
    }
    try {
      const stored = JSON.parse(localStorage.getItem(historyKey) || "[]");
      setRecent(Array.isArray(stored) ? stored : []);
    } catch {
      setRecent([]);
    }
  }, [token, historyKey]);

  React.useEffect(() => {
    setPage(1);
    setSongs([]);
    setMedia([]);
  }, [filter]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      runSearch(q, filter, 1, false);
    }
  }, [searchParams, filter]);

  const runSearch = async (value, type = filter, nextPage = 1, append = false) => {
    if (!value.trim()) return;
    setLoading(true);
    setError("");
    startLoading();
    try {
      if (type === "songs") {
        const data = await searchSongs(value.trim(), nextPage);
        const list = Array.isArray(data) ? data : data?.results || [];
        const normalized = list.map(normalizeSong);
        setSongs(append ? [...songs, ...normalized] : normalized);
        setMedia([]);
      }
      if (type === "albums") {
        const data = await searchAlbums(value.trim(), nextPage);
        const list = Array.isArray(data) ? data : data?.results || [];
        const normalized = list.map(normalizeAlbum);
        setMedia(append ? [...media, ...normalized] : normalized);
        setSongs([]);
      }
      if (type === "playlists") {
        const data = await searchPlaylists(value.trim(), nextPage);
        const list = Array.isArray(data) ? data : data?.results || [];
        const normalized = list.map(normalizePlaylist);
        setMedia(append ? [...media, ...normalized] : normalized);
        setSongs([]);
      }
      if (type === "artists") {
        const data = await searchArtists(value.trim(), nextPage);
        const list = Array.isArray(data) ? data : data?.results || [];
        const normalized = list.map(normalizeArtist);
        setMedia(append ? [...media, ...normalized] : normalized);
        setSongs([]);
      }
      if (type === "global") {
        const data = await searchGlobal(value.trim());
        const list = Array.isArray(data) ? data : data?.results || [];
        const normalized = list.map(normalizeGlobal);
        setMedia(normalized);
        setSongs([]);
      }
      setPage(nextPage);
      if (token && historyKey) {
        const normalizedQuery = value.trim();
        setRecent((prev) => {
          const next = [normalizedQuery, ...prev.filter((q) => q !== normalizedQuery)].slice(0, 6);
          localStorage.setItem(historyKey, JSON.stringify(next));
          return next;
        });
      }
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
    runSearch(value, filter, 1, false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    runSearch(query, filter, 1, false);
  };

  const handleLoadMore = () => {
    if (filter === "global") return;
    runSearch(query, filter, page + 1, true);
  };

  const handleOpen = (item) => {
    if (filter === "playlists" || item?.type === "playlist") {
      navigate(`/playlist/${item.id}`);
      return;
    }
    if (item?.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-36 overflow-x-hidden">
      <div className="glass rounded-3xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Search</p>
            <h2 className="text-2xl md:text-3xl font-semibold mt-2">Find your next obsession.</h2>
            <p className="text-white/70 mt-1 text-sm">Search songs, artists, or moods in seconds.</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["Workout", "Chill", "Love", "Party"].map((tag) => (
              <button key={tag} className={chipStyles} onClick={() => quickSearch(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-xs uppercase tracking-[0.3em] text-white/50">Search by</span>
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none w-full sm:w-auto bg-slate-950/80 border border-white/10 rounded-full px-4 py-2 pr-10 text-xs uppercase tracking-[0.2em] text-white/80 focus:outline-none focus:border-emerald-300"
            >
              {filters.map((item) => (
                <option key={item.key} value={item.key} className="bg-slate-950 text-white">
                  {item.label}
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none h-4 w-4 text-white/60 absolute right-3 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        {token && recent.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-white/50">Recent</span>
            {recent.map((item) => (
              <button key={item} className={chipStyles} onClick={() => quickSearch(item)}>
                {item}
              </button>
            ))}
            <button
              type="button"
              className="px-3 py-2 rounded-full text-xs uppercase tracking-[0.2em] border border-white/10 text-white/60 hover:text-white"
              onClick={() => {
                if (historyKey) {
                  localStorage.removeItem(historyKey);
                }
                setRecent([]);
              }}
            >
              Clear
            </button>
          </div>
        )}

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
        {!loading && songs.length === 0 && media.length === 0 && (
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

      {!loading && media.length > 0 && (
        <div className="mt-6">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {media.map((item) => (
              <MediaTile key={`${item.id}-${item.title}`} item={item} list={media} type={filter} onOpen={() => handleOpen(item)} />
            ))}
          </div>
          {filter !== "global" && (
            <div className="mt-4">
              <button
                className="glass rounded-2xl px-5 py-3 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white"
                onClick={handleLoadMore}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
