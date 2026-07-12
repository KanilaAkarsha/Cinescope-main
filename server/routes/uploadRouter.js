// routes/uploadRouter.js
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import protect from "../middleware/authMiddleware.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Configured:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "Present" : "Missing",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "Present" : "Missing",
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // Increased to 10MB
});
const uploadRouter = express.Router();

uploadRouter.post(
  "/image",
  protect,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: "File upload error", error: err.message });
      } else if (err) {
        return res.status(400).json({ message: "Unknown upload error", error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        console.warn("Upload attempt without file");
        return res.status(400).json({ message: "No file provided" });
      }

      console.log(`Uploading file: ${req.file.originalname} (${req.file.mimetype})`);

      // Convert buffer to base64
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "cinescope/avatars",
        transformation: [{ width: 400, height: 400, crop: "fill" }],
      });

      console.log("Upload successful:", result.secure_url, "Public ID:", result.public_id);
      return res.status(200).json({ 
        url: result.secure_url,
        public_id: result.public_id 
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return res.status(error.http_code || 400).json({ 
        message: "Image upload failed", 
        error: error.message,
        details: error.http_code ? `Status ${error.http_code}` : undefined
      });
    }
  },
);

export default uploadRouter;
