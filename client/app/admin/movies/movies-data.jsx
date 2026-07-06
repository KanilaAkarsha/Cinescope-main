"use client";

import { getAllMoviesForAdmin } from "@/services/movie.service";
import MovieTable from "./movie-table";
import { useEffect, useState } from "react";

export default function MoviesData({ searchParams = {} }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Admin movies fetching with params:", searchParams);
        const res = await getAllMoviesForAdmin(searchParams);
        console.log("Admin movies fetch raw response:", res);

        const { success, data, message } = res;

        if (success && Array.isArray(data)) {
          const refinedMovies = data.map((movie) => ({
            id: movie._id ? movie._id.toString() : Math.random().toString(),
            title: movie.title || "Untitled",
            year: movie.releaseYear || movie.year || "N/A",
            plot: movie.plot || movie.description || "",
            rating: movie.rating || movie.rated || 0,
            genres: Array.isArray(movie.genre) ? movie.genre : Array.isArray(movie.genres) ? movie.genres : [],
            poster: movie.poster,
            backdrop: movie.backdrop,
            runtime: movie.runtime || 0,
            status: movie.status ?? "published",
            director: movie.director || movie.directors || "",
            directors: movie.director || movie.directors || "",
            cast: movie.cast || [],
            trailer: movie.trailer || movie.trailerVideoLink || "",
            language: movie.language || "",
            releaseDate: movie.releaseYear || movie.year || "",
          }));
          setMovies(refinedMovies);
        } else {
          setError(message || "No movies found");
        }
      } catch (err) {
        console.error("Admin movies fetch error:", err);
        setError("Failed to fetch movies: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [JSON.stringify(searchParams || {})]);

  if (loading) return <div>Loading movies...</div>;
  if (error) return <div className="p-4 text-red-500 bg-red-50 rounded border border-red-200">{error}</div>;
  if (!movies.length) return <div className="p-8 text-center border-2 border-dashed rounded-lg text-muted-foreground">No Movies Available!</div>;

  return <MovieTable movies={movies} />;
}
