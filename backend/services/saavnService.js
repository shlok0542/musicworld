import axios from "axios";

const BASE_URL = process.env.SAAVN_BASE_URL || "https://saavn.sumit.co";

export const searchSongs = async (query, page = 1) => {
  const url = `${BASE_URL}/api/search/songs`;
  const response = await axios.get(url, { params: { query, page } });
  return response.data;
};

export const getSongById = async (id) => {
  const url = `${BASE_URL}/api/songs`;
  const response = await axios.get(url, { params: { ids: id } });
  return response.data;
};