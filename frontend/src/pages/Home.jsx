import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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

const HOME_CACHE_KEY = "mw-home-cache-v1";
const HOME_CACHE_TTL_MS = 10 * 60 * 1000;

const Home = () => {
  const navigate = useNavigate();
  const hasLoadedRef = React.useRef(false);
  const [sections, setSections] = React.useState(() =>
    sectionConfig.map((section) => ({
      ...section,
      songs: [],
      page: 1,
      loading: true,
      loadingMore: false
    }))
  );

  const writeCache = (nextSections) => {
    try {
      const payload = {
        updatedAt: Date.now(),
        sections: nextSections.map((section) => ({
          title: section.title,
          query: section.query,
          songs: section.songs,
          page: section.page
        }))
      };
      localStorage.setItem(HOME_CACHE_KEY, JSON.stringify(payload));
    } catch {
      undefined;
    }
  };

  const loadSection = async (index, page, replace = false) => {
    setSections((prev) =>
      prev.map((section, idx) =>
        idx === index
          ? { ...section, loading: replace, loadingMore: !replace }
          : section
      )
    );

    try {
      const query = sectionConfig[index]?.query || "";
      const data = await searchSongs(query, page);
      const list = Array.isArray(data) ? data : data?.results || [];
      const normalized = list.map(normalizeSong);

      setSections((prev) => {
        const nextSections = prev.map((item, idx) =>
          idx === index
            ? {
                ...item,
                songs: replace ? normalized : [...item.songs, ...normalized],
                page,
                loading: false,
                loadingMore: false
              }
            : item
        );
        writeCache(nextSections);
        return nextSections;
      });
    } catch {
      setSections((prev) =>
        prev.map((item, idx) =>
          idx === index ? { ...item, loading: false, loadingMore: false } : item
        )
      );
    }
  };

  React.useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    try {
      const cached = JSON.parse(localStorage.getItem(HOME_CACHE_KEY));
      if (cached?.updatedAt && Date.now() - cached.updatedAt < HOME_CACHE_TTL_MS) {
        const cachedSections = sectionConfig.map((section, index) => {
          const cachedItem = cached.sections?.[index];
          return {
            ...section,
            songs: cachedItem?.songs || [],
            page: cachedItem?.page || 1,
            loading: false,
            loadingMore: false
          };
        });
        setSections(cachedSections);
        return;
      }
    } catch {
      undefined;
    }

    sectionConfig.forEach((_, index) => {
      loadSection(index, 1, true);
    });
  }, []);

  const heroSongs = React.useMemo(() => sections[0]?.songs?.slice(0, 2) || [], [sections]);

  const handleStart = () => {
    const target = document.getElementById("discover");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-44">
      <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-8 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">MusicWorld</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mt-4">
            Fresh drops. Instant play.
          </h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="px-5 py-3 rounded-full bg-emerald-400 text-slate-900 font-semibold"
              onClick={handleStart}
            >
              Start Listening
            </button>
            <button
              className="px-5 py-3 rounded-full border border-white/15 text-white/80"
              onClick={() => navigate("/playlists")}
            >
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

      <section id="discover" className="mt-10 md:mt-12 space-y-10">
        {sections.map((section, index) => (
          <div key={section.title}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{section.title}</h2>
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
                section.songs.map((song) => (
                  <SongTile key={`${section.title}-${song.songId}`} song={song} list={section.songs} />
                ))}
              {!section.loading && (
                <button
                  className="glass rounded-2xl px-5 py-4 min-w-[160px] text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white"
                  onClick={() => loadSection(index, section.page + 1, false)}
                  disabled={section.loadingMore}
                >
                  {section.loadingMore ? "Loading..." : "Load More"}
                </button>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
