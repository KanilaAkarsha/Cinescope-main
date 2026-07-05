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
      try {
        const { success, data, message } = await getAllMoviesForAdmin(searchParams);
        if (success) {
          const refinedMovies = data.map((movie) => ({
            id: movie._id.toString(),
            title: movie.title,
            year: movie.releaseYear || movie.year,
            plot: movie.plot || movie.description,
            rating: movie.rating || movie.rated,
            genres: movie.genre || movie.genres,
            poster: movie.poster,
            backdrop: movie.backdrop,
            runtime: movie.runtime,
            status: movie.status ?? "published",
            director: movie.director || movie.directors || "",
            directors: movie.director || movie.directors || "",
            cast: movie.cast,
            trailer: movie.trailer || movie.trailerVideoLink || "",
            language: movie.language || "",
            releaseDate: movie.releaseYear || movie.year,
          }));
          setMovies(refinedMovies);
        } else {
          setError(message || "No movies found");
        }
      } catch (err) {
        setError("Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [JSON.stringify(searchParams)]);

  if (loading) return <div>Loading movies...</div>;
  if (error) return <div>{error}</div>;
  if (!movies.length) return <div>No Movies Available!</div>;

  return <MovieTable movies={movies} />;
}
