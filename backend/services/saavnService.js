import axios from "axios";

const BASE_URL = process.env.SAAVN_BASE_URL || "https://saavn.sumit.co";

export const searchSongs = async (query, page = 1) => {
  const url = `${BASE_URL}/api/search/songs`;
  const response = await axios.get(url, { params: { query, page } });
  return response.data;
};

export const searchAlbums = async (query, page = 1) => {
  const url = `${BASE_URL}/api/search/albums`;
  const response = await axios.get(url, { params: { query, page } });
  return response.data;
};

export const searchPlaylists = async (query, page = 1) => {
  const url = `${BASE_URL}/api/search/playlists`;
  const response = await axios.get(url, { params: { query, page } });
  return response.data;
};

export const searchArtists = async (query, page = 1) => {
  const url = `${BASE_URL}/api/search/artists`;
  const response = await axios.get(url, { params: { query, page } });
  return response.data;
};

export const searchGlobal = async (query) => {
  const url = `${BASE_URL}/api/search`;
  const response = await axios.get(url, { params: { query } });
  return response.data;
};

export const getSongById = async (id) => {
  const url = `${BASE_URL}/api/songs`;
  const response = await axios.get(url, { params: { ids: id } });
  return response.data;
};

export const getPlaylistById = async (id, page = 1) => {
  const url = `${BASE_URL}/api/playlists`;
  const response = await axios.get(url, { params: { id, page } });
  return response.data;
};
