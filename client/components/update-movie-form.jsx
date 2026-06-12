"use client";

import { useState, useEffect } from "react";
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

import { Textarea } from "@/components/ui/textarea";
import { updateMovie } from "@/services/movie.service";

import { getAllMovieStatus, getAllYears, getAllLanguages } from "@/lib/utils";
import { getAllGenres } from "@/lib/data";

function TagInput({ tags, setTags, placeholder }) {
  const [value, setValue] = useState("");

  const addTag = (v) => {
    v = v.trim();
    if (!v || tags.includes(v)) return;
    setTags([...tags, v]);
  };

  return (
    <div className="flex flex-wrap gap-2 border p-2 rounded">
      {tags.map((t, i) => (
        <span key={i} className="bg-gray-200 px-2 py-1 rounded">
          {t}
          <button
            type="button"
            onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
            className="ml-2">
            ×
          </button>
        </span>
      ))}

      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(value);
            setValue("");
          }
        }}
        className="flex-1 outline-none"
      />
    </div>
  );
}

export default function UpdateMovieForm({ movie, showDialog }) {
  const router = useRouter();
  const years = getAllYears();
  const statuses = getAllMovieStatus();
  const languages = getAllLanguages();
  const allGenres = getAllGenres();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState({
    title: "",
    year: "",
    director: "",
    rating: "",
    runtime: "",
    overview: "",
    poster: "",
    backdrop: "",
    movieFileLink: "",
    trailer: "",
    language: "",
    status: "",
  });

  const [castTags, setCastTags] = useState([]);
  const [genreTags, setGenreTags] = useState([]);

  // ✅ LOAD DATA ON OPEN
  useEffect(() => {
    if (!movie) return;

    setFormState({
      title: movie.title || "",
      year: movie.releaseYear ? String(movie.releaseYear) : "",
      director: movie.director || "",
      rating: movie.rating || "",
      runtime: movie.runtime || "",
      overview: movie.description || movie.plot || "",
      poster: movie.poster || "",
      backdrop: movie.backdrop || "",
      movieFileLink: movie.downloadLink || "",
      trailer: movie.trailer || "",
      language: movie.language || "",
      status: movie.status || "",
    });

    setCastTags(movie.cast || []);
    setGenreTags(movie.genre || []);
  }, [movie]);

  const updateField = (key, value) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleGenre = (g) => {
    setGenreTags((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      downloadLink: formState.movieFileLink,
    };

    setIsSubmitting(true);

    try {
      const res = await updateMovie(movie?._id || movie?.id, movieDoc);

      if (res?.success) {
        router.refresh();
        showDialog(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[70vh] overflow-auto">
      {/* TITLE */}
      <div>
        <Label>Title</Label>
        <Input
          value={formState.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      {/* YEAR + DIRECTOR */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Year</Label>
          <Select
            value={formState.year}
            onValueChange={(v) => updateField("year", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Director</Label>
          <Input
            value={formState.director}
            onChange={(e) => updateField("director", e.target.value)}
          />
        </div>
      </div>

      {/* CAST */}
      <div>
        <Label>Cast</Label>
        <TagInput tags={castTags} setTags={setCastTags} />
      </div>

      {/* GENRE */}
      <div>
        <Label>Genre</Label>
        <div className="flex flex-wrap gap-2">
          {allGenres.map((g) => (
            <button
              type="button"
              key={g}
              onClick={() => toggleGenre(g)}
              className={`px-3 py-1 border rounded ${
                genreTags.includes(g) ? "bg-black text-white" : ""
              }`}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* RATING + RUNTIME */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Rating</Label>
          <Input
            type="number"
            value={formState.rating}
            onChange={(e) => updateField("rating", e.target.value)}
          />
        </div>

        <div>
          <Label>Runtime</Label>
          <Input
            type="number"
            value={formState.runtime}
            onChange={(e) => updateField("runtime", e.target.value)}
          />
        </div>
      </div>

      {/* OVERVIEW */}
      <div>
        <Label>Overview</Label>
        <Textarea
          value={formState.overview}
          onChange={(e) => updateField("overview", e.target.value)}
        />
      </div>

      {/* MEDIA */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Poster"
          value={formState.poster}
          onChange={(e) => updateField("poster", e.target.value)}
        />

        <Input
          placeholder="Backdrop"
          value={formState.backdrop}
          onChange={(e) => updateField("backdrop", e.target.value)}
        />

        <Input
          placeholder="Movie File"
          value={formState.movieFileLink}
          onChange={(e) => updateField("movieFileLink", e.target.value)}
        />

        <Input
          placeholder="Trailer"
          value={formState.trailer}
          onChange={(e) => updateField("trailer", e.target.value)}
        />
      </div>

      {/* LANGUAGE + STATUS */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Language</Label>
          <Select
            value={formState.language}
            onValueChange={(v) => updateField("language", v)}>
            <SelectTrigger />
            <SelectContent>
              {languages.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Status</Label>
          <Select
            value={formState.status}
            onValueChange={(v) => updateField("status", v)}>
            <SelectTrigger />
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* BUTTONS */}
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => showDialog(false)}>
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Movie"}
        </Button>
      </DialogFooter>
    </form>
  );
}
