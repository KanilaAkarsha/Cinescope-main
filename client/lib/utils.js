import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getAllYears() {
  return Array.from({ length: 100 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );
}

export function getAllGenres() {
  return [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Musicals",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Sports",
    "Thriller",
    "Western",
  ];
}

export function getAllMovieStatus() {
  return ["Published", "Draft", "Archived"];
}

export function capitalizeFirstLetter(str) {
  if (str.length === 0) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
