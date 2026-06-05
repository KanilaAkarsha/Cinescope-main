import { searchMovies } from "@/services/movie.service";
import MovieTable from "./movie-table";

export default async function MoviesData({ query = "" }) {
  //Fetch movies data from database
  //option 1: fetch from api route
  //option 2: direct database query (server component)

  try {
    const { data: moviesData = [] } = await searchMovies(query);
    // console.log( "Movies" , moviesData);

    if (!moviesData.length) throw new Error("No movies found");

    const refinedMovies = moviesData.map((movie) => ({
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
      directors: movie.director || movie.directors,
      cast: movie.cast,
      releaseDate: movie.releaseYear || movie.year,
    }));

    return <MovieTable movies={refinedMovies} />;
  } catch {
    return <div>No Movies Available!</div>;
  }
}
