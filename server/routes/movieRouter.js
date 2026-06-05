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

movieRouter.get("/admin/movies", protect, getAllMoviesForAdmin);
movieRouter.get("/search", getAllMoviesForUser);
movieRouter.get("/", getAllMoviesForUser);
movieRouter.get("/:id", getMovieById);
movieRouter.post("/create", protect, createMovie);
movieRouter.put("/:id/update", protect, updateMovie);
movieRouter.delete("/:id", protect, deleteMovie);
movieRouter.get("/reviews/all", protect, getAllReviews); // Added for admin
movieRouter.put("/reviews/:reviewId/status", protect, updateReviewStatus);
movieRouter.delete("/reviews/:reviewId", protect, deleteReview);
movieRouter.get("/:id/reviews", getReviewsForMovie);
movieRouter.post("/:id/reviews", protect, createReviewForMovie);
movieRouter.delete("/:id/reviews/:reviewId", protect, deleteReview); // Added for user (specific movie context)

export default movieRouter;
