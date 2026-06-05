"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllMovieStatus, getAllYears, cn } from "@/lib/utils";
import { getAllGenres } from "@/lib/data";
import { Textarea } from "@/components/ui/textarea";
import { createMovie } from "@/services/movie.service";
import { toast } from "react-hot-toast";

function TagInput({ className, tags, setTags, placeholder }) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (value) => {
    const v = String(value || "").trim();
    if (!v) return;
    if (tags.includes(v)) return;
    setTags((prev) => [...prev, v]);
  };

  const removeTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
      setInputValue("");
    }
    if (e.key === "Backspace" && !inputValue) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const onBlur = () => {
    if (inputValue) {
      addTag(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-primary/20  px-3 py-2">
      {tags.map((tag, idx) => (
        <span key={`${tag}-${idx}`}>
          <span className="truncate max-w-32">{tag}</span>
          <button
            type="button"
            onClick={() => removeTag(idx)}
            aria-label={`Remove ${tag}`}
            className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-[10px]">
            ×
          </button>
        </span>
      ))}
      <input
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 min-w-0 flex-1 bg-transparent text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-0",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function AddMovieForm({ showDialog }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [castTags, setCastTags] = useState([]);
  const [genreTags, setGenreTags] = useState([]);
  const years = getAllYears();
  const allGenres = getAllGenres();
  const statuses = getAllMovieStatus();

  const toggleGenre = (genre) => {
    setGenreTags((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const movie = {
      title: formData.get("title"),
      releaseYear: Number(formData.get("year")),
      director: formData.get("director"),
      cast: castTags.length > 0 ? castTags : [formData.get("director")],
      genre: genreTags.length > 0 ? genreTags : ["Action"],
      rating: Number(formData.get("rating")),
      runtime: Number(formData.get("runtime")),
      description: formData.get("overview") || formData.get("title"),
      plot: formData.get("overview") || formData.get("title"),
      poster: formData.get("poster"),
      backdrop: formData.get("backdrop"),
      downloadLink: formData.get("movieFileLink") || "N/A",
      trailer: formData.get("trailerVideoLink") || "N/A",
      status: formData.get("status"),
      language: formData.get("language") || "English",
    };

    setIsSubmitting(true);

    try {
      const response = await createMovie(movie);

      if (response?.success) {
        toast.success("Movie added successfully");
        router.refresh();
        setIsSubmitting(false);
        showDialog(false);
      } else {
        toast.error(response?.message || "Failed to add movie");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log("Error in handle submit:", error);
      toast.error("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="space-y-4 max-h-[70vh] overflow-auto pr-5"
      onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Title<span className="text-red-500">*</span>
          </Label>
          <Input id="title" name="title" placeholder="Movie title" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">
            Year<span className="text-red-500">*</span>
          </Label>
          <Select id="year" name="year" required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Please select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year, index) => (
                <SelectItem key={`${year}-${index}`} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="director">Director</Label>
          <Input id="director" name="director" placeholder="Director Name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cast">Cast</Label>
          <div>
            <TagInput
              tags={castTags}
              setTags={setCastTags}
              placeholder="Type a name and press Enter or comma"
            />
            <input type="hidden" name="cast" value={castTags.join(", ")} />
          </div>
        </div>
        <div className="col-span-2 space-y-2">
          <Label>
            Genre<span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {allGenres.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${
                  genreTags.includes(genre)
                    ? "bg-primary text-white"
                    : "border border-primary/20 text-foreground hover:border-primary/50"
                }`}>
                {genre}
              </button>
            ))}
          </div>
          <input type="hidden" name="genre" value={genreTags.join(", ")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rating">
            IMDb Rating<span className="text-red-500">*</span>
          </Label>
          <Input
            id="rating"
            name="rating"
            placeholder="IMDb Rating (0.0 - 10.0)"
            type="number"
            max="10"
            min="0"
            step="0.1"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="runtime">
            Runtime<span className="text-red-500">*</span>
          </Label>
          <Input
            id="runtime"
            name="runtime"
            placeholder="Runtime in Minutes"
            type="number"
            max="1000"
            min="0"
            step="1"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="overview">Overview</Label>
        <Textarea
          id="overview"
          name="overview"
          placeholder="Movie discription"
          className="h-25"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="poster">
            Poster URL<span className="text-red-500">*</span>
          </Label>
          <Input
            id="poster"
            name="poster"
            placeholder="URL to Poster image"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="backdrop">
            Backdrop URL<span className="text-red-500">*</span>
          </Label>
          <Input
            id="backdrop"
            name="backdrop"
            placeholder="URL to Backdrop image"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="movieFileLink">Movie File Link</Label>
          <Input
            id="movieFileLink"
            name="movieFileLink"
            placeholder="URL to downloadable movie file"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="trailerVideoLink">Trailer Video Link</Label>
          <Input
            id="trailerVideoLink"
            name="trailerVideoLink"
            placeholder="URL to trailer video or YouTube link"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">
            Language<span className="text-red-500">*</span>
          </Label>
          <Input
            id="language"
            name="language"
            placeholder="Movie Language"
            defaultValue="English"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">
            Status<span className="text-red-500">*</span>
          </Label>
          <Select id="status" name="status" required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status, index) => (
                <SelectItem key={`${status}-${index}`} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button
          type="reset"
          variant="outline"
          className="min-w-25.5 "
          disabled={isSubmitting}
          onClick={() => showDialog(false)}>
          Cancel
        </Button>
        <Button type="submit" className="min-w-25.5" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Movie"}
        </Button>
      </DialogFooter>
    </form>
  );
}
