import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL || "http://localhost:5001",
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Log for debugging (only in development or if needed)
      // console.log(`Request to ${config.url} with token: ${token.substring(0, 10)}...`);
    } else {
      // console.warn(`Request to ${config.url} without token`);
    }
  }
  return config;
});

export default API;
