import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaylist } from "../services/musicService.js";
import SongCard from "../components/SongCard.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import { useUI } from "../context/UIContext.jsx";

const PlaylistDetails = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { showToast, startLoading, stopLoading } = useUI();
  const sentinelRef = useRef(null);

  const loadPage = async (nextPage, replace = false) => {
    if (!id) return;
    if (nextPage === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    startLoading();
    try {
      const data = await getPlaylist(id, nextPage);
      const newSongs = Array.isArray(data?.songs) ? data.songs : [];
      setPlaylist(data);
      const total = data?.songCount || 0;
      setSongs((prev) => {
        const base = replace ? [] : prev;
        const merged = [...base, ...newSongs];
        const seen = new Set();
        const deduped = merged.filter((s) => {
          if (seen.has(s.songId)) return false;
          seen.add(s.songId);
          return true;
        });
        setHasMore(deduped.length < total && newSongs.length > 0);
        return deduped;
      });
      setPage(nextPage);
    } catch {
      showToast({ type: "error", message: "Failed to load playlist." });
    } finally {
      setLoading(false);
      setLoadingMore(false);
      stopLoading();
    }
  };

  useEffect(() => {
    setSongs([]);
    setPage(1);
    setHasMore(true);
    loadPage(1, true);
  }, [id]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    if (!hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadPage(page + 1, false);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [page, hasMore, loadingMore]);

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-36">
      <div className="glass rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={
              playlist?.image ||
              "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80&auto=format"
            }
            alt={playlist?.name || "Playlist"}
            className="h-40 w-40 rounded-2xl object-cover border border-white/20"
          />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Playlist</p>
            <h2 className="text-3xl md:text-4xl font-semibold mt-2 break-words">
              {playlist?.name || "Loading"}
            </h2>
            <p className="text-white/70 mt-2 break-words">
              {playlist?.description || "Curated for your vibe."}
            </p>
            <p className="text-xs text-white/50 mt-3">{playlist?.songCount || 0} songs</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {loading && Array.from({ length: 4 }).map((_, idx) => <LoadingSkeleton key={idx} />)}
        {!loading && songs.length === 0 && (
          <div className="glass rounded-2xl p-6 text-center text-white/60">No songs found.</div>
        )}
        {songs.map((song) => (
          <SongCard key={song.songId} song={song} list={songs} />
        ))}
        {loadingMore && (
          <div className="glass rounded-2xl p-4 text-center text-white/60">Loading more...</div>
        )}
        {hasMore && <div ref={sentinelRef} />}
      </div>
    </div>
  );
};

export default PlaylistDetails;
