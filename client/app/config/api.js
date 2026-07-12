import axios from "axios";
import { store } from "@/app/app/store";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL || "http://localhost:5001",
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Priority 1: Redux state (most up-to-date in-memory)
    // Priority 2: Local storage (persistence)
    const state = store.getState();
    const token = state.auth.token || localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;
