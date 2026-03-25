import api from "./api";

export const toggleLike = async (song) => {
  const { data } = await api.post("/users/likes", { song });
  return data;
};

export const addHistory = async (song) => {
  const { data } = await api.post("/users/history", { song });
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get("/users/me");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.patch("/users/me", payload);
  return data;
};
