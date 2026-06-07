import { searchMovies } from "@/services/movie.service";

export default async function TotalMovies({ query = "" }) {
  const { data: moviesData = [] } = await searchMovies(query);

  const refinedMovies = moviesData.map((movie) => ({
    status: movie.status ?? "Published", // keep real status
  }));

  const publishedCount = refinedMovies.filter(
    (m) => m.status === "Published",
  ).length;

  return (
    <>
      <div className="text-2xl font-bold">{refinedMovies.length}</div>
      <p className="text-muted-foreground text-xs">
        {publishedCount} published
      </p>
    </>
  );
}
