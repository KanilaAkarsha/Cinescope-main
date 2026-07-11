/* eslint-disable react/prop-types */
"use client";

import { useEffect, useState } from "react";
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

const resolveMovieField = (movie, keys, fallback = "") => {
  for (const key of keys) {
    const value = movie?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
};

const normalizeMovieData = (movie) => {
  const year = resolveMovieField(movie, ["releaseYear", "year"]);
  const genres = resolveMovieField(movie, ["genres", "genre"], []);
  const cast = resolveMovieField(movie, ["cast"], []);
  const language = resolveMovieField(movie, ["language"]);

  return {
    title: resolveMovieField(movie, ["title"]),
    year: year ? String(year) : "",
    director: Array.isArray(movie?.director)
      ? movie.director[0] || ""
      : resolveMovieField(movie, ["director", "directors"]),
    rating: movie?.rating ?? movie?.imdb?.rating ?? "",
    runtime: resolveMovieField(movie, ["runtime"], ""),
    overview: resolveMovieField(movie, ["description", "plot"]),
    poster: resolveMovieField(movie, ["poster"]),
    backdrop: resolveMovieField(movie, ["backdrop"]),
    downloadLink: resolveMovieField(movie, ["downloadLink", "movieFileLink"]),
    trailer: resolveMovieField(movie, ["trailer", "trailerVideoLink"]),
    language,
    status: resolveMovieField(movie, ["status"]),
    castTags: Array.isArray(cast)
      ? cast
      : parseCommaSeparated(String(cast || "")),
    genreTags: Array.isArray(genres)
      ? genres
      : parseCommaSeparated(String(genres || "")),
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
  const normalizedMovie = normalizeMovieData(movie);
  const [formState, setFormState] = useState({
    title: normalizedMovie.title,
    year: normalizedMovie.year,
    director: normalizedMovie.director,
    rating: normalizedMovie.rating,
    runtime: normalizedMovie.runtime,
    overview: normalizedMovie.overview,
    poster: normalizedMovie.poster,
    backdrop: normalizedMovie.backdrop,
    downloadLink: normalizedMovie.downloadLink,
    trailer: normalizedMovie.trailer,
    language: normalizedMovie.language,
    status: normalizedMovie.status,
  });

  const [castTags, setCastTags] = useState(normalizedMovie.castTags);
  const [genreTags, setGenreTags] = useState(normalizedMovie.genreTags);
  const years = getAllYears();
  const statuses = getAllMovieStatus();
  const allGenres = getAllGenres();
  const languages = [
    ...(normalizedMovie.language ? [normalizedMovie.language] : []),
    ...getAllLanguages().filter(
      (language) => language !== normalizedMovie.language,
    ),
  ];

  useEffect(() => {
    const nextMovie = normalizeMovieData(movie);

    setFormState({
      title: nextMovie.title,
      year: nextMovie.year,
      director: nextMovie.director,
      rating: nextMovie.rating,
      runtime: nextMovie.runtime,
      overview: nextMovie.overview,
      poster: nextMovie.poster,
      backdrop: nextMovie.backdrop,
      downloadLink: nextMovie.downloadLink,
      trailer: nextMovie.trailer,
      language: nextMovie.language,
      status: nextMovie.status,
    });
    setCastTags(nextMovie.castTags);
    setGenreTags(nextMovie.genreTags);
  }, [movie]);

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

    const movieDoc = {
      title: formState.title,

      description: formState.overview,

      releaseYear: Number(formState.year),

      genre: genreTags,

      director: formState.director,

      cast: castTags,

      plot: formState.overview,

      poster: formState.poster,

      backdrop: formState.backdrop,

      rating: Number(formState.rating),

      trailer: formState.trailer,

      language: formState.language,

      status: formState.status,

      runtime: Number(formState.runtime),

      downloadLink: formState.downloadLink,
    };

    setIsSubmitting(true);

    try {
      const response = await updateMovie(
        movie?._id || movie?.id,

        movieDoc,
      );

      if (response?.success) {
        window.location.reload();

        showDialog(false);
      }
    } catch (error) {
      console.error("Update failed:", error);
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
            value={formState.year || ""}
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
                <SelectItem key={`${year}-${index}`} value={String(year)}>
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
            value={formState.director}
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
          <Label htmlFor="downloadLink">Movie File Link</Label>
          <Input
            id="downloadLink"
            name="downloadLink"
            placeholder="URL to downloadable movie file"
            value={formState?.downloadLink}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="trailerVideoLink">Trailer Video Link</Label>
          <Input
            id="trailer"
            name="trailer"
            value={formState.trailer}
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
