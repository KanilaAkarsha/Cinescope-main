import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL || "http://localhost:5001",
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;
