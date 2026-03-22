import api from "./api";

export const toggleLike = async (song) => {
  const { data } = await api.post("/users/likes", { song });
  return data;
};

export const addHistory = async (song) => {
  const { data } = await api.post("/users/history", { song });
  return data;
};
