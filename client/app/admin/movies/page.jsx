
import AddMoviesForm from "@/components/add-movie-form";
import MoviesData from "./movies-data";
import AddMovieDialog from "@/components/add-movie-dialog";
import MovieSelectors from "./movie-selectors";

export default function MoviesPage({ searchParams }) {
    return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Movies</h2>
          <p className="text-muted-foreground">Manage Your movies catalog</p>
        </div>
        <AddMovieDialog/>
      </div>

      <MovieSelectors/>

      <MoviesData searchParams={searchParams}/>
    </div>
    );
}