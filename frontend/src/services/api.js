import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

let lastRateLimitNotice = 0;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mw-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      const now = Date.now();
      if (now - lastRateLimitNotice > 5000) {
        lastRateLimitNotice = now;
        window.dispatchEvent(new CustomEvent("mw-rate-limit"));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
