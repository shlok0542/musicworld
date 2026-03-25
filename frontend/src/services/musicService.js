import api from "./api";

export const searchSongs = async (query, page = 1) => {
  const { data } = await api.get(`/search?q=${encodeURIComponent(query)}&page=${page}`);
  return data;
};

export const searchAlbums = async (query, page = 1) => {
  const { data } = await api.get(`/search/albums?q=${encodeURIComponent(query)}&page=${page}`);
  return data;
};

export const searchPlaylists = async (query, page = 1) => {
  const { data } = await api.get(`/search/playlists?q=${encodeURIComponent(query)}&page=${page}`);
  return data;
};

export const searchArtists = async (query, page = 1) => {
  const { data } = await api.get(`/search/artists?q=${encodeURIComponent(query)}&page=${page}`);
  return data;
};

export const searchGlobal = async (query) => {
  const { data } = await api.get(`/search/global?q=${encodeURIComponent(query)}`);
  return data;
};

export const getSong = async (id) => {
  const { data } = await api.get(`/song/${id}`);
  return data;
};

export const getPlaylist = async (id, page = 1) => {
  const { data } = await api.get(`/playlist/${id}?page=${page}`);
  return data;
};
