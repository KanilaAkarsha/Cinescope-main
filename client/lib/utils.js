import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getAllYears() {
  return Array.from({ length: 100 }, (_, i) =>
    (new Date().getFullYear() - i).toString(),
  );
}

export function getAllLanguages() {
  return [
    "English",
    "Spanish",
    "French",
    "German",
    "Japanese",
    "Chinese",
    "Hindi",
    "Tamil",
    "Telugu",
    "Malayalam",
    "Bengali",
    "Russian",
    "Korean",
    "Italian",
    "Portuguese",
    "Arabic",
    "Turkish",
    "Vietnamese",
    "Indonesian",
    "Thai",
    "Polish",
    "Dutch",
    "Sinhalese",
    "Swedish",
    "Danish",
    "Norwegian",
    "Finnish",
    "Greek",
    "Hebrew",
    "Czech",
    "Hungarian",
    "Romanian",
    "Bulgarian",
    "Serbian",
    "Croatian",
    "Ukrainian",
  ];
}

export function getAllMovieStatus() {
  return ["Published", "Draft", "Archived"];
}

export const getGoogleDriveFileId = (url) => {
  if (!url) return null;

  const match =
      url.match(/\/d\/([^/]+)/) ||
      url.match(/[?&]id=([^&]+)/);

  return match ? match[1] : null;
};

export const convertGoogleDriveLink = (url) => {
  const fileId = getGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url;
};

export function capitalizeFirstLetter(str) {
  if (str.length === 0) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getCloudinaryUrl(publicId) {
  if (!publicId) return null;
  // If it's already a URL, return it
  if (publicId.startsWith("http")) return publicId;
  
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dq7vkvvpx"; // Fallback to a known cloud name if needed, but better to use env
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/v1/${publicId}`;
}
