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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});
const uploadRouter = express.Router();

uploadRouter.post(
  "/image",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file provided" });
      }

      // Convert buffer to base64
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "cinescope/avatars",
        transformation: [{ width: 400, height: 400, crop: "fill" }],
      });

      return res.status(200).json({ url: result.secure_url });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(400).json({ message: error.message });
    }
  },
);

export default uploadRouter;
