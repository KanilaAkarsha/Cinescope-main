"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UpdateMovieForm from "./update-movie-form";

export default function UpdateMovieDialog( {open, onOpenChange, movie} ) {

  return ( 
  <Dialog open={open} onOpenChange={onOpenChange}>
 
  <DialogContent className="sm:max-w-[37.5rem]">
    <DialogHeader>
      <DialogTitle>Update Movie</DialogTitle>
      <DialogDescription>
        Fill in the details to Update the movie.
      </DialogDescription>
    </DialogHeader>
    <UpdateMovieForm showDialog={onOpenChange} movie={movie}/>
  </DialogContent>
</Dialog>
  )
}
