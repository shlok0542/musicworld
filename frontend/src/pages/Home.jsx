import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MediaTile from "../components/MediaTile.jsx";
import { usePlayer } from "../context/PlayerContext.jsx";
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

const MoodChip = ({ children, active = false, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
      active
        ? "bg-emerald-400 text-white shadow-glow"
        : "border border-white/10 bg-white/5 text-white/75 hover:border-violet-300/40 hover:text-white"
    }`}
  >
    {children}
  </button>
);

const ShelfHeader = ({ title, eyebrow, onPrevious, onNext, showArrows = true }) => (
  <div className="flex items-end justify-between gap-4">
    <div className="min-w-0">
      {eyebrow && <p className="mb-1 text-xs font-medium uppercase tracking-[0.22em] text-violet-300">{eyebrow}</p>}
      <h2 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
    </div>
    {showArrows && (
      <div className="flex shrink-0 items-center gap-2">
        <button type="button" onClick={onPrevious} aria-label={`Previous ${title}`} className="shelf-arrow">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <button type="button" onClick={onNext} aria-label={`Next ${title}`} className="shelf-arrow">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
    )}
  </div>
);

const Shelf = ({ section, index, handleOpen, loadSection }) => {
  const shelfRef = React.useRef(null);
  const scrollShelf = (direction) => {
    shelfRef.current?.scrollBy({ left: direction * 360, behavior: "smooth" });
  };

  return (
    <section className="home-shelf">
      <ShelfHeader
        title={section.title}
        onPrevious={() => scrollShelf(-1)}
        onNext={() => scrollShelf(1)}
      />
      <div ref={shelfRef} className="shelf-track mt-5">
        {(section.loading || section.unavailable || section.items.length === 0)
          ? Array.from({ length: 5 }).map((_, itemIndex) => (
              <div key={itemIndex} className="home-skeleton">
                <div className="aspect-square w-full rounded-2xl bg-white/10" />
                <div className="mt-3 h-3 w-3/4 rounded bg-white/10" />
                <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
              </div>
            ))
          : section.items.map((item) => (
              <MediaTile
                key={`${section.title}-${item.id}`}
                item={item}
                list={section.items}
                type={section.type}
                onOpen={() => handleOpen(item, section.type)}
                variant="carousel"
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
    </section>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { setCurrentTrack } = usePlayer();
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

  const quickPicks = React.useMemo(() => {
    const latest = sections[0]?.items || [];
    const trending = sections[1]?.items || [];
    return [...latest, ...trending].filter((song, index, list) => list.findIndex((item) => item.songId === song.songId) === index).slice(0, 6);
  }, [sections]);

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="home-page px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
      <div className="mood-row gap-4">
        <MoodChip active>All</MoodChip>
        <MoodChip>Romance</MoodChip>
        <MoodChip>Feel good</MoodChip>
        <MoodChip>Relax</MoodChip>
        <MoodChip>Party</MoodChip>
        <MoodChip>Focus</MoodChip>
        <MoodChip>Throwback</MoodChip>
      </div>

      <section id="discover" className="mt-9">
        <ShelfHeader title="Quick picks" showArrows={false} />
        <div className="quick-picks mt-5">
          {quickPicks.length === 0
            ? Array.from({ length: 4 }).map((_, index) => <div key={index} className="quick-pick-skeleton" />)
            : quickPicks.map((song) => (
                <button key={song.songId} type="button" onClick={() => setCurrentTrack(song, quickPicks)} className="quick-pick group">
                  <img src={song.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block truncate text-sm font-semibold text-white">{song.title}</span>
                    <span className="mt-1 block truncate text-xs text-white/55">{song.artist}</span>
                  </span>
                  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-violet-300 opacity-0 transition group-hover:opacity-100" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </button>
              ))}
        </div>
      </section>

      <section className="mt-14 space-y-14">
        {sections.map((section, index) => (
          <Shelf key={section.title} section={section} index={index} handleOpen={handleOpen} loadSection={loadSection} />
        ))}
      </section>
    </motion.div>
  );
};

export default Home;
