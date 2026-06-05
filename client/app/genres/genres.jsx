"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { getMovies, getGenres } from "@/actions/movies";

export default function Genres() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesData, genresData] = await Promise.all([
          getMovies(),
          getGenres(),
        ]);
        setMovies(moviesData);

        if (genresData.length === 0 && moviesData.length > 0) {
          const extractedGenres = [
            ...new Set(
              moviesData.flatMap((m) =>
                Array.isArray(m.genre) ? m.genre : m.genre ? [m.genre] : [],
              ),
            ),
          ];
          setGenres(extractedGenres);
        } else {
          setGenres(genresData);
        }
      } catch (error) {
        console.error("Failed to fetch genres data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="text-foreground font-medium text-center py-12">
          Loading genres...
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="text-foreground font-medium text-center py-12">
          No movies available.
        </div>
      </div>
    );
  }

  const getMovieGenres = (movie) => {
    if (Array.isArray(movie?.genre)) return movie.genre;
    if (Array.isArray(movie?.genres)) return movie.genres;
    if (typeof movie?.genre === "string") return [movie.genre];
    if (typeof movie?.genres === "string") return [movie.genres];
    return [];
  };

  // Count movies per genre
  const genreCounts = genres.map((genre) => ({
    name: genre,
    count: movies.filter((movie) => getMovieGenres(movie).includes(genre))
      .length,
    movies: movies
      .filter((movie) => getMovieGenres(movie).includes(genre))
      .slice(0, 4),
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
          <div className="flex-1 space-y-4">
            <h1 className="inline-block text-4xl font-extrabold tracking-tight lg:text-5xl">
              Genres
            </h1>
            <p className="text-xl text-primary/90">Explore movies by genre</p>
          </div>
        </div>

        <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
          {genreCounts.map((genre) => (
            <Card
              key={genre.name}
              className="flex flex-col hover:shadow-md hover:shadow-primary/20 transition-all">
              <CardHeader className="border-b border-primary/10">
                <CardTitle className="text-primary">{genre.name}</CardTitle>
                <CardDescription>{genre.count} movies</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pt-4">
                <div className="grid grid-cols-2 gap-2">
                  {genre.movies.map((movie, idx) => {
                    const key =
                      movie?.id || movie?._id || `${genre.name}-${idx}`;
                    const href = `/movies/${movie?.id || movie?._id || ""}`;
                    return (
                      <Link
                        key={key}
                        href={href}
                        className="overflow-hidden rounded-md">
                        <img
                          src={movie.poster || "/placeholder.svg"}
                          alt={movie.title}
                          className="aspect-2/3 h-auto w-full object-cover transition-all hover:scale-105"
                          width={200}
                          height={300}
                        />
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
