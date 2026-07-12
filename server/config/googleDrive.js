import { google } from "googleapis";

export const drive = google.drive({
    version: "v3",
    auth: process.env.GOOGLE_API_KEY,
});