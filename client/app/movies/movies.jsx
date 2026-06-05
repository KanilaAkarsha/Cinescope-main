"use client";

import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import MoviesList, { MovieListSkeleton } from "@/components/home/movies-list";
import MovieSelectors from "@/app/admin/movies/movie-selectors";

export default function MoviesPart() {
  return (
    <div>
      <section id="featured-movies" className="container px-4 py-12 md:px-6">
        <Suspense fallback={<MovieListSkeleton />}>
          <MoviesWithSuspense />
        </Suspense>
      </section>
    </div>
  );
}

function MoviesWithSuspense() {
  return (
    <>
      {/* Heading area */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Movies</h2>
          <p className="text-muted-foreground">
            Our section of must-watch films
          </p>
        </div>

        <Button variant="outline">View All</Button>
      </div>

      {/* Movie search */}
      <MovieSelectors />

      {/*  Movies List */}
      <MoviesList />
    </>
  );
}
