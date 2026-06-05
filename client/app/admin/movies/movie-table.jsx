"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import UpdateMovieDialog from "@/components/update-movie-dialog";
import DeleteMovieDialog from "@/components/delete-movie-dialog";
import { deleteMovie } from "@/services/movie.service";

export default function MovieTable({ movies }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const toggleUpdateDialog = (open) => {
    requestAnimationFrame(() => setShowUpdateDialog(open || !showUpdateDialog));
  };

  const toggleDeleteDialog = (open) => {
    requestAnimationFrame(() => setShowDeleteDialog(open || !showDeleteDialog));
  };

  const handleDeleteMovie = async (movieId) => {
    setIsLoading(true);
    const res = await deleteMovie(movieId);

    if (res?.success) {
      setIsLoading(false);
      toggleDeleteDialog(false);
      setSelectedMovie(null);
      router.refresh();
    }
  };

  const getStatusClass = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "published":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption className="sr-only ">Admin Movies Table</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead className="text-center">Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movies.map((movie, key) => (
            <TableRow key={movie.id}>
              <TableCell className="font-medium"> {key + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/movies/${movie?.id}`}
                    className="flex items-center gap-2">
                    <Image
                      src={movie.poster ?? "/placeholder.svg"}
                      width={28}
                      height={40}
                      alt={movie.title}
                      className="h-10 w-7 rounded object-cover"
                      unoptimized
                    />
                    <span className="font-medium max-w-60 text-wrap line-clamp-2">
                      {movie.title}
                    </span>
                  </Link>
                </div>
              </TableCell>
              <TableCell>{movie.year}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {movie.genres.map((genre) => (
                    <Badge key={genre} variant="outline" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {movie.rating ||
                  (movie?.imdb?.rating
                    ? Number(movie.imdb.rating).toFixed(1)
                    : "N/A")}
              </TableCell>
              <TableCell className="capitalize">
                <Badge className={getStatusClass(movie?.status)}>
                  {movie.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost " className="h-8 w-8 p-0">
                      <span className="sr-only">Open Menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Movie Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/movies/${movie?.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedMovie(movie);
                        toggleUpdateDialog(true);
                      }}>
                      Update
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => {
                        setSelectedMovie(movie);
                        toggleDeleteDialog(true);
                      }}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UpdateMovieDialog
        open={showUpdateDialog}
        onOpenChange={toggleUpdateDialog}
        movie={selectedMovie}
      />

      <DeleteMovieDialog
        open={showDeleteDialog}
        onOpenChange={toggleDeleteDialog}
        movie={selectedMovie}
        onConfirm={handleDeleteMovie}
        isLoading={isLoading}
      />
    </div>
  );
}
