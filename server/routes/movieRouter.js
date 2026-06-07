import express from "express";
import {
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getAllMoviesForAdmin,
  getAllMoviesForUser,
  getReviewsForMovie,
  createReviewForMovie,
  getAllReviews,
  deleteReview,
  updateReviewStatus,
} from "../controllers/movieControllers.js";
import protect from "../middleware/authMiddleware.js";

const movieRouter = express.Router();

// ✅ Specific routes FIRST
movieRouter.get("/admin/movies", protect, getAllMoviesForAdmin);
movieRouter.get("/search", getAllMoviesForUser);
movieRouter.get("/reviews/all", protect, getAllReviews);
movieRouter.put("/reviews/:reviewId/status", protect, updateReviewStatus);
movieRouter.delete("/reviews/:reviewId", protect, deleteReview);
movieRouter.post("/create", protect, createMovie);
movieRouter.get("/", getAllMoviesForUser);

// ✅ Wildcard /:id routes LAST
movieRouter.get("/:id", getMovieById);
movieRouter.put("/:id/update", protect, updateMovie);
movieRouter.delete("/:id", protect, deleteMovie);
movieRouter.get("/:id/reviews", getReviewsForMovie);
movieRouter.post("/:id/reviews", protect, createReviewForMovie);
movieRouter.delete("/:id/reviews/:reviewId", protect, deleteReview);

export default movieRouter;
