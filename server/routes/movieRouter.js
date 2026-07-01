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
import requireAdmin from "../middleware/requireAdmin.js";

const movieRouter = express.Router();

// ✅ Specific routes FIRST
movieRouter.get("/admin/movies", protect, requireAdmin, getAllMoviesForAdmin);
movieRouter.get("/search", getAllMoviesForUser);
movieRouter.get("/reviews/all", protect, requireAdmin, getAllReviews);
movieRouter.put(
  "/reviews/:reviewId/status",
  protect,
  requireAdmin,
  updateReviewStatus,
);
movieRouter.delete("/reviews/:reviewId", protect, requireAdmin, deleteReview);
movieRouter.post("/create", protect, requireAdmin, createMovie);
movieRouter.get("/", getAllMoviesForUser);

// ✅ Wildcard /:id routes LAST
movieRouter.get("/:id", getMovieById);
movieRouter.put("/:id/update", protect, requireAdmin, updateMovie);
movieRouter.delete("/:id", protect, requireAdmin, deleteMovie);
movieRouter.get("/:id/reviews", getReviewsForMovie);
movieRouter.post("/:id/reviews", protect, createReviewForMovie);
movieRouter.delete(
  "/:id/reviews/:reviewId",
  protect,
  requireAdmin,
  deleteReview,
);

export default movieRouter;
