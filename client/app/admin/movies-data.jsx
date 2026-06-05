import { searchMovies } from "@/services/movie.service";
import RecentMovies from "./recent-movies";

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
      plot: movie.plot,
      rated: movie.rated || movie.rating,
      genres: movie.genre || movie.genres,
      poster: movie.poster,
      backdrop: movie.backdrop,
      imdb: movie.imdb || { rating: movie.rating },
      runtime: movie.runtime,
      status: movie.status ?? "published",
      directors: movie.director || movie.directors,
      cast: movie.cast,
      releaseDate: movie.releaseDate ?? movie.releaseYear ?? movie.year,
    }));

    return <RecentMovies movies={refinedMovies} />;
  } catch {
    return <div>No Movies Available!</div>;
  }
}
