"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "@/app/config/api";
import { login, setLoading } from "@/app/app/features/authSlice";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      let token = localStorage.getItem("token");

      if (!token) {
        // Fallback to cookie if localStorage is empty
        const cookies = document.cookie.split("; ");
        const tokenCookie = cookies.find((row) => row.startsWith("token="));
        if (tokenCookie) {
          token = tokenCookie.split("=")[1];
          localStorage.setItem("token", token);
        }
      }

      if (token && !user) {
        try {
          dispatch(setLoading(true));
          const { data } = await API.get("/api/users/me");
          dispatch(login({ token, user: data.user }));
        } catch (error) {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem("token");
          // Optionally clear cookie here too if needed
        } finally {
          dispatch(setLoading(false));
        }
      } else {
        dispatch(setLoading(false));
      }
    };

    initializeAuth();
  }, [dispatch, user]);

  return <>{children}</>;
}
