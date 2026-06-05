import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function RecentMovies({ movies }) {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {movies.map((movie) => (
          <Card key={movie.id} className="overflow-hidden py-0">
            <div className="aspect-video w-full overflow-hidden">
              <Image
                src={movie.poster ?? "/placeholder.svg"}
                alt={movie.title}
                className="w-full object-cover"
                width={200}
                height={400}
                unoptimized
                priority
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="line-clamp-1">{movie.title}</CardTitle>
              <CardDescription>
                {movie.year} • {movie.genres?.join(", ")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex justify-between">
                <span className="text-sm">
                  Rating: {movie?.imdb?.rating}/10
                </span>
                <Link
                  href={`/admin/movies/${movie.id}`}
                  className="text-primary text-sm hover:underline">
                  View Details
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-end">
        <Link
          href="/admin/movies"
          className="text-primary text-sm hover:underline m-7">
          View All Movies →
        </Link>
      </div>
    </div>
  );
}
