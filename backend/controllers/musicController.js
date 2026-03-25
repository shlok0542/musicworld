import {
  searchSongs,
  searchAlbums,
  searchPlaylists,
  searchArtists,
  searchGlobal,
  getSongById,
  getPlaylistById
} from "../services/saavnService.js";

const pickImage = (images = []) => {
  if (!Array.isArray(images) || images.length === 0) return "";
  const preferred = images.find((img) => img.quality === "500x500");
  return (preferred || images[images.length - 1]).url || "";
};

const pickAudio = (downloads = []) => {
  if (!Array.isArray(downloads) || downloads.length === 0) return "";
  return downloads[downloads.length - 1].url || "";
};

const normalizeSong = (item) => ({
  songId: item.id,
  title: item.name,
  artist: Array.isArray(item.artists?.primary)
    ? item.artists.primary.map((a) => a.name).join(", ")
    : "",
  image: pickImage(item.image),
  duration: Number(item.duration || 0),
  url: pickAudio(item.downloadUrl)
});

const unwrapResults = (data) => {
  if (Array.isArray(data?.data?.results)) return data.data.results;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export const search = async (req, res, next) => {
  try {
    const query = req.query.q;
    const page = Number(req.query.page || 1);
    if (!query) {
      return res.status(400).json({ message: "Query parameter q is required" });
    }
    const data = await searchSongs(query, page);
    const results = unwrapResults(data);
    res.json(results.map(normalizeSong));
  } catch (err) {
    next(err);
  }
};

export const searchAlbumsController = async (req, res, next) => {
  try {
    const query = req.query.q;
    const page = Number(req.query.page || 1);
    if (!query) {
      return res.status(400).json({ message: "Query parameter q is required" });
    }
    const data = await searchAlbums(query, page);
    res.json(unwrapResults(data));
  } catch (err) {
    next(err);
  }
};

export const searchPlaylistsController = async (req, res, next) => {
  try {
    const query = req.query.q;
    const page = Number(req.query.page || 1);
    if (!query) {
      return res.status(400).json({ message: "Query parameter q is required" });
    }
    const data = await searchPlaylists(query, page);
    res.json(unwrapResults(data));
  } catch (err) {
    next(err);
  }
};

export const searchArtistsController = async (req, res, next) => {
  try {
    const query = req.query.q;
    const page = Number(req.query.page || 1);
    if (!query) {
      return res.status(400).json({ message: "Query parameter q is required" });
    }
    const data = await searchArtists(query, page);
    res.json(unwrapResults(data));
  } catch (err) {
    next(err);
  }
};

export const searchGlobalController = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: "Query parameter q is required" });
    }
    const data = await searchGlobal(query);
    res.json(unwrapResults(data));
  } catch (err) {
    next(err);
  }
};

export const songById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getSongById(id);
    const song = Array.isArray(data?.data) ? data.data[0] : null;
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.json(normalizeSong(song));
  } catch (err) {
    next(err);
  }
};

export const playlistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = Number(req.query.page || 1);
    const data = await getPlaylistById(id, page);
    const playlist = data?.data;
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    const songs = Array.isArray(playlist.songs) ? playlist.songs.map(normalizeSong) : [];
    res.json({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description || "",
      image: pickImage(playlist.image),
      songCount: playlist.songCount || songs.length,
      songs
    });
  } catch (err) {
    next(err);
  }
};
