import React, { useEffect, useState } from "react";
import PlaylistCard from "../components/PlaylistCard.jsx";
import SongCard from "../components/SongCard.jsx";
import { createPlaylist, fetchPlaylists, addSongToPlaylist } from "../services/playlistService.js";
import { searchSongs } from "../services/musicService.js";
import { normalizeSong } from "../utils/normalizeSong.js";
import { useUI } from "../context/UIContext.jsx";

const LibraryPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const [active, setActive] = useState(null);
  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState([]);
  const { showToast, startLoading, stopLoading } = useUI();

  const loadPlaylists = async () => {
    try {
      const data = await fetchPlaylists();
      setPlaylists(data);
    } catch {
      undefined;
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    startLoading();
    try {
      const created = await createPlaylist(name.trim());
      setPlaylists((prev) => [created, ...prev]);
      setName("");
      showToast({ type: "success", message: "Playlist created." });
    } catch {
      showToast({ type: "error", message: "Login to create playlists." });
    } finally {
      stopLoading();
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    startLoading();
    try {
      const data = await searchSongs(search.trim());
      const list = Array.isArray(data) ? data : data?.results || [];
      setSongs(list.map(normalizeSong));
    } catch {
      showToast({ type: "error", message: "Search failed." });
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-36 grid lg:grid-cols-[1fr_1.2fr] gap-6 lg:gap-8">
      <div className="glass rounded-3xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Playlists</p>
            <h2 className="text-2xl md:text-3xl font-semibold mt-2">Craft your neon mixes.</h2>
            <p className="text-white/60 mt-1 text-sm">Create a playlist and start collecting favorites.</p>
          </div>
        </div>
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New playlist name"
            className="flex-1 bg-transparent border border-white/10 rounded-2xl px-4 py-3"
          />
          <button
            onClick={handleCreate}
            className="px-4 py-3 rounded-2xl bg-emerald-400 text-slate-900 font-semibold"
          >
            Create
          </button>
        </div>
        <div className="mt-6 grid gap-4">
          {playlists.length === 0 && (
            <div className="glass rounded-2xl p-6 text-center text-white/60">
              No playlists yet. Create one to start collecting tracks.
            </div>
          )}
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist._id}
              playlist={playlist}
              onOpen={() => setActive(playlist)}
            />
          ))}
        </div>
      </div>

      <div className="glass rounded-3xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Add Tracks</p>
            <h2 className="text-2xl md:text-3xl font-semibold mt-2">Fill the mix.</h2>
            <p className="text-white/60 mt-1 text-sm">Search tracks and drop them into your playlist.</p>
          </div>
        </div>
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for songs"
            className="flex-1 bg-transparent border border-white/10 rounded-2xl px-4 py-3"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-3 rounded-2xl border border-white/10 text-white/70"
          >
            Find
          </button>
        </div>

        {active && (
          <div className="mt-4 text-xs text-emerald-300">Adding to: {active.name}</div>
        )}

        <div className="mt-6 grid gap-4">
          {songs.length === 0 && (
            <div className="glass rounded-2xl p-6 text-center text-white/60">
              Search to load tracks and start building your playlist.
            </div>
          )}
          {songs.map((song) => (
            <SongCard
              key={song.songId}
              song={song}
              list={songs}
              onAdd={async () => {
                if (!active) {
                  showToast({ type: "error", message: "Select a playlist first." });
                  return;
                }
                startLoading();
                try {
                  await addSongToPlaylist(active._id, song);
                  loadPlaylists();
                  showToast({ type: "success", message: "Added to playlist." });
                } catch {
                  showToast({ type: "error", message: "Login to manage playlists." });
                } finally {
                  stopLoading();
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryPlaylists;
