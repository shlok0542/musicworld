import { searchSongs, getSongById } from "../services/saavnService.js";

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

export const search = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: "Query parameter q is required" });
    }
    const data = await searchSongs(query);
    const results = Array.isArray(data?.data?.results) ? data.data.results : [];
    res.json(results.map(normalizeSong));
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
