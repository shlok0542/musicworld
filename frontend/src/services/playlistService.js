import api from "./api";

export const fetchPlaylists = async () => {
  const { data } = await api.get("/playlists");
  return data;
};

export const createPlaylist = async (name) => {
  const { data } = await api.post("/playlists", { name });
  return data;
};

export const addSongToPlaylist = async (playlistId, song) => {
  const { data } = await api.post(`/playlists/${playlistId}/songs`, { song });
  return data;
};

export const removeSongFromPlaylist = async (playlistId, songId) => {
  const { data } = await api.delete(`/playlists/${playlistId}/songs/${songId}`);
  return data;
};

export const deletePlaylist = async (playlistId) => {
  const { data } = await api.delete(`/playlists/${playlistId}`);
  return data;
};
