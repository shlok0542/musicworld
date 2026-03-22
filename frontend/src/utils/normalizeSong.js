export const pickImage = (image) => {
  if (typeof image === "string") return image;
  if (Array.isArray(image) && image.length > 0) {
    const preferred = image.find((img) => img.quality === "500x500");
    return (preferred || image[image.length - 1]).url || "";
  }
  return "";
};

export const pickAudio = (downloadUrl, fallback) => {
  if (typeof fallback === "string" && fallback) return fallback;
  if (Array.isArray(downloadUrl) && downloadUrl.length > 0) {
    return downloadUrl[downloadUrl.length - 1].url || "";
  }
  return "";
};

export const normalizeSong = (item) => ({
  songId: item.songId || item.song_id || item.id,
  title: item.title || item.song_name || item.name,
  artist:
    item.artist ||
    item.song_artist ||
    (Array.isArray(item.artists?.primary)
      ? item.artists.primary.map((a) => a.name).join(", ")
      : ""),
  image: pickImage(item.image || item.song_image),
  duration: Number(item.duration || item.song_duration || 0),
  url: pickAudio(item.downloadUrl || item.download_links, item.url)
});