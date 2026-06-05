"use client";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddMovieForm from "./add-movie-form";
export default function AddMovieDialog() {
  const [showAddMovie, setShowAddMovie] = useState(false);
  return ( 
  <Dialog open={showAddMovie} onOpenChange={setShowAddMovie}>
  <DialogTrigger asChild>
    <Button><PlusIcon className="mr-2 w-4 h-4"/>Add Movie</Button>
    </DialogTrigger>
  <DialogContent className="sm:max-w-[37.5rem]">
    <DialogHeader>
      <DialogTitle>Add New Movie</DialogTitle>
      <DialogDescription>
        Fill in the details to add a new movie to your catalog.
      </DialogDescription>
    </DialogHeader>
    <AddMovieForm showDialog={setShowAddMovie}/>
  </DialogContent>
</Dialog>
  )
}
