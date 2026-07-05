import MoviesData from "./movies-data";
import AddMovieDialog from "@/components/add-movie-dialog";
import MovieSelectors from "./movie-selectors";
import { Suspense } from "react";

export default function MoviesPage({ searchParams }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Movies</h2>
          <p className="text-muted-foreground">Manage Your movies catalog</p>
        </div>
        <AddMovieDialog />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <MovieSelectors />
      </Suspense>
      <Suspense fallback={<div>Loading movies...</div>}>
        <MoviesData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
