import { getMovieById } from "@/services/movie.service";
import { getReviewsForMovie } from "@/services/review.service";
import MovieDetails from "./movie-details";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

export default async function MovieDetailsPage({ params }) {
  const { id } = await params;
  const [movie, reviews] = await Promise.all([
    getMovieById(id),
    getReviewsForMovie(id),
  ]);
  const { isAuthenticated, user } = await getCurrentUser();

  if (!movie?.success || !movie?.data) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold">Movie not found</h1>
          <p className="text-muted-foreground">
            The movie you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/" className="mt-4">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Passing server data to client component
  return (
    <MovieDetails
      movie={movie.data}
      reviews={reviews?.data || []}
      id={id}
      isAuthenticated={isAuthenticated}
      user={user}
    />
  );
}
