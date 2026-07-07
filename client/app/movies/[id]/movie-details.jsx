"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Book, Clock, Download, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { createReview } from "@/services/review.service";

const getDownloadOptions = (movie) => {
  const rawLinks = movie?.movieFileLinks;

  if (Array.isArray(rawLinks)) {
    return rawLinks
      .map((entry, index) => {
        if (typeof entry === "string") {
          return {
            label: `Option ${index + 1}`,
            value: entry,
          };
        }

        if (!entry) {
          return null;
        }

        return {
          label:
            entry.label ||
            entry.resolution ||
            entry.quality ||
            `Option ${index + 1}`,
          value: entry.url || entry.link || entry.href || "",
        };
      })
      .filter((entry) => Boolean(entry?.value));
  }

  if (rawLinks && typeof rawLinks === "object") {
    return Object.entries(rawLinks)
      .map(([label, value]) => ({
        label,
        value:
          typeof value === "string"
            ? value
            : value?.url || value?.link || value?.href || "",
      }))
      .filter((entry) => Boolean(entry.value));
  }

  if (movie?.movieFileLink) {
    return [
      {
        label: "Default",
        value: movie.movieFileLink,
      },
    ];
  }

  return [];
};

const getTrailerEmbedUrl = (url) => {
  const value = String(url || "").trim();

  if (!value) return "";

  try {
    const parsed = new URL(value);
    const host = parsed.hostname.replace(/^www\./, "");

    // YouTube Shorts
    if (host.includes("youtube.com") && parsed.pathname.startsWith("/shorts/")) {
      const videoId = parsed.pathname.split("/")[2];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // YouTube standard
    if (host.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // YouTube short link (youtu.be)
    if (host === "youtu.be") {
      const videoId = parsed.pathname.replace("/", "");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return value;
  } catch {
    return value;
  }
};

export default function MovieDetails({
  movie,
  reviews,
  id,
  isAuthenticated,
  user,
}) {
  const router = useRouter();
  const isLoading = false;
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [movieReviews, setMovieReviews] = useState([]);
  useEffect(() => {
    if (Array.isArray(reviews)) {
      setMovieReviews(reviews);
    }
  }, [reviews]);
  const downloadOptions = getDownloadOptions(movie);
  const [selectedDownload, setSelectedDownload] = useState(
    downloadOptions[0]?.value || "",
  );
  const trailerUrl = getTrailerEmbedUrl(
    movie?.trailer || movie?.trailerVideoLink || movie?.videoLink,
  );
  const formatReviewDate = (value) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(value));

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!id) {
      toast.error("Movie id is missing.");
      return;
    }

    if (rating < 1 || rating > 10) {
      toast.error("Please select a rating between 1 and 10.");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please add your review comment.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createReview({
        movieId: id,
        rating,
        comment: reviewText.trim(),
      });

      if (!result?.success) {
        throw new Error(result?.message || "Failed to submit review");
      }

      if (result?.data) {
        // Use either _id or id from the result
        const reviewId = result.data._id || result.data.id;
        // Add current user info to the review for immediate display
        const newReview = {
          ...result.data,
          id: reviewId,
          _id: reviewId,
          userName: user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : "You",
          userAvatar: user?.profilePicture || "",
        };
        console.log("New review:", newReview);
        setMovieReviews((current) => [newReview, ...current]);
      }

      setIsSubmitting(false);
      setReviewText("");
      setRating(0);
      toast.success("Review submitted successfully.");
      // Force refresh data since we're using server components for the initial load
      router.refresh();
    } catch (error) {
      console.error("Submission failed:", error);
      setIsSubmitting(false);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit review",
      );
    }
  };

  if (!movie && !isLoading) {
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

  return (
    <div className="min-h-screen">
      {isLoading ? (
        <div className="w-full">
          <Skeleton className="aspect-21/9 w-full" />
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:gap-8">
              <Skeleton className="h-100 w-75 rounded-lg" />
              <div className="mt-6 flex-1 space-y-4 md:mt-0">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <div className="flex gap-2 py-2">
                  <Skeleton className="h-8 w-16 rounded-full" />
                  <Skeleton className="h-8 w-16 rounded-full" />
                  <Skeleton className="h-8 w-16 rounded-full" />
                </div>
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        movie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full">
            <div
              className="relative h-[50vh] w-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${movie.backdrop})`,
                backgroundPosition: "center 20%",
              }}>
              <div className="bg-linear-to-t from-background absolute inset-0 to-transparent" />
              <div className="container relative mx-auto flex h-full items-end px-4 pb-8">
                <Link href="/" className="absolute left-4 top-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/50 backdrop-blur-xs rounded-full">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row md:gap-8">
                <div className="relative -mt-32 overflow-hidden rounded-lg border md:w-75">
                  <img
                    src={movie.poster || "/placeholder.svg"}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="mt-6 flex-1 space-y-4 md:mt-0">
                  <h1 className="text-3xl font-bold">
                    {movie.title}{" "}
                    <span className="text-muted-foreground">
                      ({movie.releaseYear || movie.year})
                    </span>
                  </h1>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center">
                      <Star className="mr-1 h-5 w-5 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium">
                        {movie.rating || movie.rated || movie?.imdb?.rating}/10
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="text-muted-foreground mr-1 h-4 w-4" />
                      <span>{movie.runtime} min</span>
                    </div>
                    <div className="flex items-center">
                      <Book className="text-muted-foreground mr-1 h-4 w-4" />
                      <span>{movie.language}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(movie.genre || movie.genres)
                      ? movie.genre || movie.genres
                      : []
                    ).map((genre) => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">Overview</h2>
                    <p className="text-muted-foreground mt-2">
                      {movie.description || movie.plot || movie.overview}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">Director</h2>
                    <p className="text-muted-foreground mt-2">
                      {movie.director}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Cast</h2>
                    <p className="text-muted-foreground mt-2">
                      {Array.isArray(movie.cast)
                        ? movie.cast.join(", ")
                        : movie.cast}
                    </p>
                  </div>
                </div>
              </div>

              {downloadOptions.length > 0 && (
                <div className="mt-8">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {downloadOptions.length > 1 && (
                      <Select
                        value={selectedDownload}
                        onValueChange={setSelectedDownload}>
                        <SelectTrigger className="w-full sm:w-56">
                          <SelectValue placeholder="Choose resolution" />
                        </SelectTrigger>
                        <SelectContent>
                          {downloadOptions.map((option) => (
                            <SelectItem key={option.label} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <Button asChild>
                      <a
                        href={selectedDownload || downloadOptions[0]?.value}
                        target="_blank"
                        rel="noreferrer"
                        download>
                        <Download className="mr-2 h-4 w-4" />
                        Download Movie
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {trailerUrl && (
                <div className="mt-10 space-y-3">
                  <h2 className="text-2xl font-bold">Trailer</h2>
                  {trailerUrl.includes("youtube.com/embed/") ? (
                    <div className="aspect-video overflow-hidden rounded-lg border">
                      <iframe
                        src={trailerUrl}
                        title={`${movie.title} trailer`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div>
                      <Button asChild variant="outline">
                        <a href={trailerUrl} target="_blank" rel="noreferrer">
                          Watch Trailer
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-12">
                <h2 className="text-2xl font-bold">Reviews</h2>

                <div className="mt-6 space-y-6">
                  {movieReviews.length > 0 ? (
                    movieReviews.map((review) => (
                      <Card key={review.id || review._id}>
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                          <Avatar>
                            <AvatarImage
                              src={
                                review.userAvatar ||
                                "/placeholder.svg?height=40&width=40"
                              }
                              alt={review.userName || "Anonymous"}
                            />
                            <AvatarFallback>
                              {(review.userName || "A").charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">
                              {review.userName || "Anonymous"}
                            </CardTitle>
                            <div className="flex items-center">
                              <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                              <span className="text-sm">
                                {review.rating}/10
                              </span>
                              <span className="text-muted-foreground mx-2 text-xs">
                                •
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {formatReviewDate(review.createdAt)}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            {review.comment}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center">
                      No reviews yet. Be the first to review!
                    </p>
                  )}
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold">Write a Review</h3>
                  {isAuthenticated ? (
                    <form
                      onSubmit={handleSubmitReview}
                      className="mt-4 space-y-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <span className="mr-2">Rating:</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="p-1">
                                <Star
                                  className={`h-5 w-5 ${
                                    star <= rating
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Textarea
                        placeholder="Share your thoughts about the movie..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="min-h-30"
                      />
                      <Button
                        type="submit"
                        disabled={
                          isSubmitting || rating === 0 || !reviewText.trim()
                        }>
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                      </Button>
                    </form>
                  ) : (
                    <div className="mt-4 rounded-lg border p-6 text-center">
                      <p className="text-muted-foreground">
                        Please{" "}
                        <Link
                          href="/login"
                          className="text-primary underline underline-offset-4">
                          login
                        </Link>{" "}
                        to write a review.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )
      )}
    </div>
  );
}
