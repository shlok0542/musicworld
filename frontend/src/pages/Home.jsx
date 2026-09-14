import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SongCard from "../components/SongCard.jsx";
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

const sectionConfig = [
  { title: "Latest Drops", query: "new releases", type: "song" },
  { title: "Trending Now", query: "trending", type: "song" },
  { title: "Top Hindi", query: "hindi hits", type: "song" },
  { title: "Playlist Picks", query: "indie", type: "playlist" },
  { title: "Artist Spotlight", query: "Adele", type: "artist" },
  { title: "Album Radar", query: "Evolve", type: "album" }
];

const HOME_CACHE_KEY = "mw-home-sections-v1";
const HOME_CACHE_TTL = 5 * 60 * 1000;

const getCachedSections = () => {
  try {
    const cached = JSON.parse(sessionStorage.getItem(HOME_CACHE_KEY) || "null");
    if (!cached || Date.now() - cached.timestamp > HOME_CACHE_TTL) return null;
    return cached.sections;
  } catch {
    return null;
  }
};

const createInitialSections = () => {
  const cachedSections = getCachedSections();
  return sectionConfig.map((section, index) => ({
    ...section,
    items: cachedSections?.[index]?.items || [],
    page: cachedSections?.[index]?.page || 1,
    loading: !cachedSections?.[index],
    loadingMore: false,
    unavailable: false
  }));
};

const Home = () => {
  const navigate = useNavigate();
  const hasLoadedRef = React.useRef(false);
  const [sections, setSections] = React.useState(createInitialSections);

  const loadSection = async (index, page, replace = false) => {
    setSections((prev) =>
      prev.map((section, idx) =>
        idx === index
          ? { ...section, loading: replace, loadingMore: !replace }
          : section
      )
    );

    try {
      const config = sectionConfig[index];
      let data;
      if (config.type === "album") data = await searchAlbums(config.query, page);
      if (config.type === "playlist") data = await searchPlaylists(config.query, page);
      if (config.type === "artist") data = await searchArtists(config.query, page);
      if (config.type === "global") data = await searchGlobal(config.query);
      if (config.type === "song") data = await searchSongs(config.query, page);

      const raw = Array.isArray(data) ? data : data?.results || [];
      let normalized = raw;
      if (config.type === "song") normalized = raw.map(normalizeSong);
      if (config.type === "album") normalized = raw.map(normalizeAlbum);
      if (config.type === "playlist") normalized = raw.map(normalizePlaylist);
      if (config.type === "artist") normalized = raw.map(normalizeArtist);
      if (config.type === "global") normalized = raw.map(normalizeGlobal);

      setSections((prev) =>
        prev.map((item, idx) =>
          idx === index
            ? {
                ...item,
                items: replace ? normalized : [...item.items, ...normalized],
                page,
                loading: false,
                loadingMore: false,
                unavailable: false
              }
            : item
        )
      );
      if (replace && page === 1) {
        try {
          const nextSections = getCachedSections() || sectionConfig.map((section) => ({
            ...section,
            items: [],
            page: 1,
            loading: false,
            loadingMore: false,
            unavailable: false
          }));
          nextSections[index] = {
            ...nextSections[index],
            items: normalized,
            page: 1,
            loading: false,
            loadingMore: false,
            unavailable: false
          };
          sessionStorage.setItem(
            HOME_CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), sections: nextSections })
          );
        } catch {
          undefined;
        }
      }
    } catch {
      setSections((prev) =>
        prev.map((item, idx) =>
          idx === index ? { ...item, loading: false, loadingMore: false, unavailable: true } : item
        )
      );
    }
  };

  React.useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const cachedSections = getCachedSections();
    const loadInitialSections = async () => {
      if (cachedSections) return;
      for (let index = 0; index < sectionConfig.length; index += 1) {
        await loadSection(index, 1, true);
      }
    };
    loadInitialSections();
  }, []);

  const heroSongs = React.useMemo(() => sections[0]?.items?.slice(0, 2) || [], [sections]);

  const handleStart = () => {
    const target = document.getElementById("discover");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleOpen = (item, type) => {
    if (type === "playlist") {
      navigate(`/playlist/${item.id}`);
      return;
    }
    if (item?.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-7 md:pt-10 pb-12">
      <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-8 items-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden md:block glass rounded-[32px] p-6"
        >
          <p className="text-sm text-white/70">Latest Drops</p>
          <div className="mt-4 space-y-4">
            {heroSongs.length === 0
              ? Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="flex gap-4 items-center animate-pulse">
                    <div className="h-14 w-14 shrink-0 rounded-2xl bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 rounded bg-white/10" />
                      <div className="h-3 w-1/2 rounded bg-white/10" />
                    </div>
                  </div>
                ))
              : heroSongs.map((song) => (
                  <SongCard key={song.songId} song={song} list={heroSongs} />
                ))}
          </div>
        </motion.div>
      </section>

      <section id="discover" className="mt-10 md:mt-12 space-y-10">
        {sections.map((section, index) => (
          <div key={section.title}>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <span className="h-px flex-1 bg-gradient-to-r from-violet-400/40 to-transparent" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {(section.loading || section.unavailable || section.items.length === 0) &&
                Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="glass rounded-2xl p-3 animate-pulse"
                  >
                    <div className="aspect-square w-full rounded-xl bg-white/10" />
                    <div className="mt-3 space-y-2">
                      <div className="h-3 w-3/4 bg-white/10 rounded" />
                      <div className="h-3 w-1/2 bg-white/10 rounded" />
                    </div>
                  </div>
                ))}
              {!section.loading && !section.unavailable &&
                section.items.map((item) => (
                  <MediaTile
                    key={`${section.title}-${item.id}`}
                    item={item}
                    list={section.items}
                    type={section.type}
                    onOpen={() => handleOpen(item, section.type)}
                    variant="grid"
                  />
                ))}
            </div>
            {!section.loading && !section.unavailable && section.items.length > 0 && section.type !== "global" && (
              <button
                className="mt-5 rounded-full border border-white/10 px-5 py-2.5 text-xs uppercase tracking-[0.25em] text-white/60 transition hover:border-violet-300/60 hover:text-white"
                onClick={() => loadSection(index, section.page + 1, false)}
                disabled={section.loadingMore}
              >
                {section.loadingMore ? "Loading..." : "Explore More"}
              </button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
