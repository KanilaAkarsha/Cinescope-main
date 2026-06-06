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
import {
  getAllMovieStatus,
  getAllYears,
  cn,
  getAllLanguages,
} from "@/lib/utils";
import { getAllGenres } from "@/lib/data";
import { Textarea } from "@/components/ui/textarea";
import { updateMovie } from "@/services/movie.service";

const parseCommaSeparated = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const buildMultiValueFields = ({ castInput, genreInput }) => {
  const parsedCast = parseCommaSeparated(castInput);
  const parsedGenres = parseCommaSeparated(genreInput);

  return {
    cast: parsedCast,
    genres: parsedGenres,
  };
};

function TagInput({ tags, setTags, placeholder, className }) {
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
      // remove last
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

export default function UpdateMovieForm({ showDialog, movie }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    title: movie?.title || "",
    releaseYear: movie?.releaseYear || movie?.releaseDate || null,
    director: movie?.director || movie?.directors?.at(0) || "",
    // retain for backward compatibility but we use tag arrays below
    cast: Array.isArray(movie?.cast) ? movie.cast.join(", ") : "",
    genre: Array.isArray(movie?.genres) ? movie.genres.join(", ") : "",
    rating: movie?.imdb?.rating || movie?.rating || "",
    runtime: movie?.runtime || "",
    overview: movie?.plot || "",
    poster: movie?.poster || "",
    backdrop: movie?.backdrop || "",
    movieFileLink: movie?.movieFileLink || movie?.fileLink || "",
    trailer: movie?.trailer || movie?.trailerLink || movie?.videoLink || "",
    language: movie?.language || "",
    status: movie?.status || "",
    releaseDate: movie?.releaseDate || "",
  });

  const [castTags, setCastTags] = useState(
    Array.isArray(movie?.cast)
      ? movie.cast
      : parseCommaSeparated(movie?.cast || movie?.cast?.toString?.() || ""),
  );
  const [genreTags, setGenreTags] = useState(
    Array.isArray(movie?.genres)
      ? movie.genres
      : parseCommaSeparated(movie?.genres || movie?.genre || ""),
  );
  const years = getAllYears();
  const statuses = getAllMovieStatus();
  const allGenres = getAllGenres();
  const languages = getAllLanguages();

  const toggleGenre = (genre) => {
    setGenreTags((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // prefer tag states if present, fallback to comma-separated form values
    const multiValueFields = buildMultiValueFields({
      castInput: formData.get("cast") || castTags.join(", "),
      genreInput: formData.get("genre") || genreTags.join(", "),
    });

    const movieDoc = {
      title: formData.get("title"),
      releaseYear: formData.get("year"),
      director: [formData.get("director")],
      cast: castTags?.length ? castTags : multiValueFields.cast,
      genres: genreTags?.length ? genreTags : multiValueFields.genres,
      imdb: { rating: Number(formData.get("rating")) },
      runtime: formData.get("runtime"),
      plot: formData.get("overview"),
      poster: formData.get("poster"),
      backdrop: formData.get("backdrop"),
      movieFileLink: formData.get("movieFileLink"),
      trailer: formData.get("trailerVideoLink"),
      status: formData.get("status"),
      releaseDate: formData.get("releaseDate"),
    };

    setIsSubmitting(true);

    try {
      const response = await updateMovie(movieDoc, movie?.id);

      if (response?.success) {
        router.refresh();
        showDialog(false);
      }
    } catch {
      console.log("Error in handle submit");
    } finally {
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
          <Input
            id="title"
            name="title"
            placeholder="Movie title"
            value={formState?.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">
            Year<span className="text-red-500">*</span>
          </Label>
          <Select
            id="year"
            name="year"
            value={formState?.year}
            onValueChange={(value) =>
              setFormState((prevState) => ({
                ...prevState,
                year: value,
              }))
            }
            required>
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
          <Input
            id="director"
            name="director"
            value={formState?.director}
            onChange={handleChange}
            placeholder="Director Name"
          />
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
            value={formState?.rating}
            onChange={handleChange}
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
            value={formState?.runtime}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="overview">Overview</Label>
        <Textarea
          id="overview"
          name="overview"
          placeholder="Movie description"
          className="h-25"
          value={formState?.overview}
          onChange={handleChange}
          required
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
            value={formState?.poster}
            onChange={handleChange}
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
            value={formState?.backdrop}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="movieFileLink">Movie File Link</Label>
          <Input
            id="movieFileLink"
            name="movieFileLink"
            placeholder="URL to downloadable movie file"
            value={formState?.movieFileLink}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="trailerVideoLink">Trailer Video Link</Label>
          <Input
            id="trailerVideoLink"
            name="trailerVideoLink"
            placeholder="URL to trailer video or YouTube link"
            value={formState?.trailerVideoLink}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">
            Language<span className="text-red-500">*</span>
          </Label>
          <Select
            id="language"
            name="language"
            value={formState?.language}
            onValueChange={(value) =>
              setFormState((prevState) => ({
                ...prevState,
                language: value,
              }))
            }
            required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language, index) => (
                <SelectItem key={`${language}-${index}`} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">
            Status<span className="text-red-500">*</span>
          </Label>
          <Select
            id="status"
            name="status"
            value={formState?.status}
            onValueChange={(value) =>
              setFormState((prevState) => ({
                ...prevState,
                status: value,
              }))
            }
            required>
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
          {isSubmitting ? "Updating..." : "Update Movie"}
        </Button>
      </DialogFooter>
    </form>
  );
}
