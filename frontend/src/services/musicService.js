import api from "./api";

export const searchSongs = async (query, page = 1) => {
  const { data } = await api.get(`/search?q=${encodeURIComponent(query)}&page=${page}`);
  return data;
};

export const getSong = async (id) => {
  const { data } = await api.get(`/song/${id}`);
  return data;
};