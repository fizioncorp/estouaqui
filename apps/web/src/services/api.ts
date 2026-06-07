import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3333";

export const api = axios.create({
  baseURL: apiBaseUrl
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("estouaqui.token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
