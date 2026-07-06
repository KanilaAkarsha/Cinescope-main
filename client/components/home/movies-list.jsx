"use client";
import MovieCard, { MovieCardSkeleton } from "./movie-card";
import { useState, useEffect } from "react";
import API from "../../app/config/api";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export default function MoviesList() {
  const [movies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  
  const query = searchParams.get("query") || "";
  const genre = searchParams.get("genre") || "";
  const year = searchParams.get("year") || "";
  const status = searchParams.get("status") || "";
  const sort = searchParams.get("sort") || "";

  useEffect(() => {
    loadUserMovies({ query, genre, year, status, sort });
  }, [query, genre, year, status, sort]);

  const loadUserMovies = async (params) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (params.query) queryParams.set("query", params.query);
      if (params.genre) queryParams.set("genre", params.genre);
      if (params.year) queryParams.set("year", params.year);
      if (params.status) queryParams.set("status", params.status);
      if (params.sort) queryParams.set("sort", params.sort);

      const url = queryParams.toString() 
        ? `/api/movies/search?${queryParams.toString()}`
        : "/api/movies";
      const { data } = await API.get(url);
      setAllMovies(data.movies || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }; // Fetch or pass movies data here

  if (loading) {
    return <MovieListSkeleton />;
  }

  if (!movies || movies.length === 0) {
    return (
      <div className=" text-foreground font-medium text-center py-12">
        No movies available.
      </div>
    );
  }

  console.log("Movies", movies);
  return (
    <div className=" grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* Loop Movies (Dynamic) */}
      {movies.map((movie, index) => (
        <div key={`${movie._id}-${index}`}>
          {/* movie card */}
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
}

export function MovieListSkeleton() {
  return (
    <div className=" grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array(8)
        .fill(0)
        .map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
    </div>
  );
}
