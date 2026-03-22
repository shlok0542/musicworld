import React from "react";
import { motion } from "framer-motion";
import SongCard from "../components/SongCard.jsx";
import SongTile from "../components/SongTile.jsx";
import { searchSongs } from "../services/musicService.js";
import { normalizeSong } from "../utils/normalizeSong.js";

const sectionConfig = [
  { title: "Latest Drops", query: "new releases" },
  { title: "Trending Now", query: "trending" },
  { title: "Top Hindi", query: "hindi hits" },
  { title: "Punjabi Energy", query: "punjabi hits" },
  { title: "Indie Spotlight", query: "indie" },
  { title: "Chillwave", query: "chill" }
];

const Home = () => {
  const [sections, setSections] = React.useState(() =>
    sectionConfig.map((section) => ({ ...section, songs: [], loading: true }))
  );

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const results = await Promise.all(
        sectionConfig.map(async (section) => {
          try {
            const data = await searchSongs(section.query);
            const list = Array.isArray(data) ? data : data?.results || [];
            return { ...section, songs: list.map(normalizeSong), loading: false };
          } catch {
            return { ...section, songs: [], loading: false, error: true };
          }
        })
      );

      if (!cancelled) {
        setSections(results);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const heroSongs = React.useMemo(() => sections[0]?.songs?.slice(0, 2) || [], [sections]);

  return (
    <div className="px-6 pb-40">
      <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">MusicWorld</p>
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight mt-4">
            A neon-first soundscape built for late-night discovery.
          </h1>
          <p className="text-white/70 mt-4">
            Jump into fresh drops, glowing playlists, and curated rooms that evolve with your mood.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="px-5 py-3 rounded-full bg-emerald-400 text-slate-900 font-semibold">
              Start Listening
            </button>
            <button className="px-5 py-3 rounded-full border border-white/15 text-white/80">
              Build a Playlist
            </button>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[32px] p-6"
        >
          <p className="text-sm text-white/70">Latest Drops</p>
          <div className="mt-4 space-y-4">
            {heroSongs.length === 0 && (
              <div className="text-xs text-white/50">Loading highlights...</div>
            )}
            {heroSongs.map((song) => (
              <SongCard key={song.songId} song={song} list={heroSongs} />
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mt-12 grid md:grid-cols-3 gap-6">
        {[
          { title: "Focus Rooms", body: "Curated waves of calm focus." },
          { title: "Neon Playlists", body: "Build glassy, glowing mixes." },
          { title: "Mood Sync", body: "Themes adapt to your genre." }
        ].map((item) => (
          <div key={item.title} className="glass rounded-2xl p-6">
            <p className="text-lg font-semibold">{item.title}</p>
            <p className="text-sm text-white/60 mt-2">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 space-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="text-xs text-white/50">Fresh pulls from Saavn</p>
            </div>
            <div className="mt-4 flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {section.loading &&
                Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="glass rounded-2xl p-3 min-w-[180px] max-w-[200px] animate-pulse"
                  >
                    <div className="h-36 w-full rounded-xl bg-white/10" />
                    <div className="mt-3 space-y-2">
                      <div className="h-3 w-3/4 bg-white/10 rounded" />
                      <div className="h-3 w-1/2 bg-white/10 rounded" />
                    </div>
                  </div>
                ))}
              {!section.loading && section.songs.length === 0 && (
                <div className="text-sm text-white/50">No tracks loaded.</div>
              )}
              {!section.loading &&
                section.songs.slice(0, 12).map((song) => (
                  <SongTile key={`${section.title}-${song.songId}`} song={song} list={section.songs} />
                ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;