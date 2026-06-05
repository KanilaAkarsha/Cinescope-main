import API from "@/app/config/api";

export const getMovies = async () => {
  try {
    const { data } = await API.get("/api/movies");
    return data.movies || [];
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

export const getMoviesByGenre = async (genre) => {
  try {
    const { data } = await API.get(`/api/movies?genre=${genre}`);
    return data.movies || [];
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
    return [];
  }
};

export const getPopularMovies = async () => {
  try {
    const { data } = await API.get("/api/movies");
    return (data.movies || []).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
};

export const getLatestMovies = async () => {
  try {
    const { data } = await API.get("/api/movies");
    return (data.movies || []).sort((a, b) => (b.releaseYear || b.year || 0) - (a.releaseYear || a.year || 0)).slice(0, 10);
  } catch (error) {
    console.error("Error fetching latest movies:", error);
    return [];
  }
};

export const getGenres = async () => {
  try {
    const movies = await getMovies();
    const genres = new Set();
    movies.forEach(movie => {
      const movieGenres = Array.isArray(movie.genre) ? movie.genre : (movie.genre ? [movie.genre] : []);
      movieGenres.forEach(g => genres.add(g));
    });
    return Array.from(genres);
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};
