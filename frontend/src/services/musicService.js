import api from "./api";

export const searchSongs = async (query) => {
  const { data } = await api.get(`/search?q=${encodeURIComponent(query)}`);
  return data;
};

export const getSong = async (id) => {
  const { data } = await api.get(`/song/${id}`);
  return data;
};
