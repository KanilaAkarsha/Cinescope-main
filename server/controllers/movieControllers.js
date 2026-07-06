import Movie from "../models/movies.js";
import users from "../models/users.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const { ObjectId } = mongoose.Types;

const checkIsAdmin = async (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return false;

    const token = authHeader.split(" ")[1];
    if (!token) return false;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    if (!decoded.userId) return false;

    const user = await users.findById(decoded.userId).select("role");
    return user?.role === "admin";
  } catch (error) {
    return false;
  }
};

export const createMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      releaseYear,
      year,
      genre,
      genres,
      director,
      directors,
      cast,
      plot,
      poster,
      backdrop,
      rating,
      imdb,
      trailer,
      trailerVideoLink,
      language,
      status,
      runtime,
      downloadLink,
      movieFileLink,
    } = req.body;

    // Field mapping and normalization
    const finalTitle = title;
    const finalDescription = description || plot || title;
    const finalReleaseYear = releaseYear || year;
    const finalGenre = genre || genres;
    const finalDirector =
      director || (Array.isArray(directors) ? directors[0] : directors);
    const finalCast = cast;
    const finalPlot = plot || description || title;
    const finalPoster = poster;
    const finalBackdrop = backdrop;
    const finalRating = rating || (imdb && imdb.rating);
    const finalTrailer = trailer || trailerVideoLink;
    const finalLanguage = language;
    const finalStatus = status;
    const finalRuntime = runtime;
    const finalDownloadLink = downloadLink || movieFileLink;

    if (
      !finalTitle ||
      !finalDescription ||
      !finalReleaseYear ||
      !finalGenre ||
      !finalBackdrop ||
      !finalDirector ||
      !finalCast ||
      !finalPlot ||
      !finalPoster ||
      !finalTrailer ||
      !finalLanguage ||
      !finalStatus ||
      !finalRuntime ||
      !finalDownloadLink
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMovie = await Movie.create({
      title: finalTitle,
      description: finalDescription,
      releaseYear: finalReleaseYear,
      genre: finalGenre,
      backdrop: finalBackdrop,
      director: finalDirector,
      cast: finalCast,
      plot: finalPlot,
      poster: finalPoster,
      rating: finalRating,
      trailer: finalTrailer,
      language: finalLanguage,
      status: finalStatus,
      runtime: finalRuntime,
      downloadLink: finalDownloadLink,
    });

    return res
      .status(201)
      .json({ message: "Movie created successfully", movie: newMovie });
  } catch (error) {
    console.error("Error creating movie:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      releaseYear,
      genre,
      director,
      cast,
      plot,
      poster,
      backdrop,
      rating,
      trailer,
      language,
      status,
      runtime,
      downloadLink,
    } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid movie id" });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      {
        title,
        description,
        releaseYear,
        genre,
        director,
        cast,
        plot,
        poster,
        backdrop,
        rating,
        trailer,
        language,
        status,
        runtime,
        downloadLink,
      },
      { new: true },
    );

    if (updatedMovie) {
      return res
        .status(200)
        .json({ message: "Movie updated successfully", movie: updatedMovie });
    } else {
      return res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    console.error("Error updating movie:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid movie id" });
    }

    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (deletedMovie) {
      return res
        .status(200)
        .json({ message: "Movie deleted successfully", movie: deletedMovie });
    } else {
      return res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    console.error("Error deleting movie:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const getAllMoviesForAdmin = async (req, res) => {
  try {
    const { query, genre, year, status, sort } = req.query;
    let filter = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { director: { $regex: query, $options: "i" } },
      ];
    }

    if (genre && genre !== "all") {
      filter.genre = { $regex: genre, $options: "i" };
    }

    if (year && year !== "all") {
      filter.releaseYear = year;
    }

    if (status && status !== "all") {
      filter.status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }

    let sortOption = { createdAt: -1 };
    if (sort) {
      switch (sort) {
        case "newest":
          sortOption = { createdAt: -1 };
          break;
        case "oldest":
          sortOption = { createdAt: 1 };
          break;
        case "title_asc":
          sortOption = { title: 1 };
          break;
        case "title_desc":
          sortOption = { title: -1 };
          break;
        case "rating_desc":
          sortOption = { rating: -1 };
          break;
        case "rating_asc":
          sortOption = { rating: 1 };
          break;
      }
    }

    const movies = await Movie.find(filter).sort(sortOption);
    return res.status(200).json({ movies });
  } catch (error) {
    console.error("Error fetching movies for admin:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const getAllMoviesForUser = async (req, res) => {
  try {
    const { query, genre, year, status, sort } = req.query;
    let filter = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { director: { $regex: query, $options: "i" } },
      ];
    }

    if (genre && genre !== "all") {
      filter.genre = { $regex: genre, $options: "i" };
    }

    if (year && year !== "all") {
      filter.releaseYear = year;
    }

    // Check if the requester is an admin
    const isAdmin = await checkIsAdmin(req);

    if (status && status !== "all") {
      const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      if (!isAdmin && formattedStatus === "Draft") {
        filter.status = { $ne: "Draft" };
      } else {
        filter.status = formattedStatus;
      }
    } else if (!isAdmin) {
      filter.status = { $ne: "Draft" };
    }

    let sortOption = { createdAt: -1 };
    if (sort) {
      switch (sort) {
        case "newest":
          sortOption = { createdAt: -1 };
          break;
        case "oldest":
          sortOption = { createdAt: 1 };
          break;
        case "title_asc":
          sortOption = { title: 1 };
          break;
        case "title_desc":
          sortOption = { title: -1 };
          break;
        case "rating_desc":
          sortOption = { rating: -1 };
          break;
        case "rating_asc":
          sortOption = { rating: 1 };
          break;
      }
    }

    const movies = await Movie.find(filter).sort(sortOption);

    return res.status(200).json({ movies });
  } catch (error) {
    console.error("Error fetching movies for user:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid movie id" });
    }

    const movie = await Movie.findById(id);

    if (movie) {
      if (movie.status === "Draft") {
        const isAdmin = await checkIsAdmin(req);
        if (!isAdmin) {
          return res.status(403).json({ message: "Draft movie access restricted" });
        }
      }
      return res.status(200).json({ movie });
    } else {
      return res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    console.error("Error fetching movie by id:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const getMovieByIdForReview = async (movieId) => {
  try {
    if (!ObjectId.isValid(movieId)) {
      return {
        success: false,
        message: "Invalid movie id",
        data: null,
      };
    }

    const movie = await Movie.findById(movieId);

    if (movie) {
      return {
        success: true,
        message: "Movie fetched successfully",
        data: movie,
      };
    } else {
      return {
        success: false,
        message: "Movie not found",
        data: null,
      };
    }
  } catch (error) {
    console.error("Error fetching movie by id for review:", error);
    return {
      success: false,
      message: "Error fetching movie",
      data: null,
    };
  }
};

export const getReviewsForMovie = async (req, res) => {
  try {
    const { id: movieId } = req.params;
    if (!ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: "Invalid movie id" });
    }

    const movie = await Movie.findById(movieId).populate(
      "reviews.userId",
      "first_name last_name profilePicture",
    );

    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // ✅ Normalize reviews for frontend
    const reviews = movie.reviews.map((review) => ({
      _id: review._id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      userName:
        `${review.userId?.first_name || ""} ${review.userId?.last_name || ""}`.trim() ||
        "Anonymous",
      userAvatar: review.userId?.profilePicture || "",
    }));

    return res.status(200).json({
      message: "Reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews for movie:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const createReviewForMovie = async (req, res) => {
  try {
    const { id: movieId } = req.params;

    const { rating, comment, userId } = req.body;

    // ✅ Guard against missing userId
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: "Invalid movie id" });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const newReview = {
      userId, // ← comes from token via protect middleware
      rating: Number(rating), // ← cast to number to be safe
      comment: comment?.trim(),
      createdAt: new Date(),
    };

    movie.reviews.push(newReview);
    await movie.save();

    const savedMovie = await Movie.findById(movieId).populate(
      "reviews.userId",
      "first_name last_name profilePicture",
    );
    const savedReview = savedMovie.reviews[savedMovie.reviews.length - 1];

    return res.status(201).json({
      message: "Review created successfully",
      review: {
        _id: savedReview._id,
        rating: savedReview.rating,
        comment: savedReview.comment,
        createdAt: savedReview.createdAt,
        userName:
          `${savedReview.userId?.first_name || ""} ${savedReview.userId?.last_name || ""}`.trim() ||
          "Anonymous",
        userAvatar: savedReview.userId?.profilePicture || "",
      },
    });
  } catch (error) {
    console.error("Error creating review:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const movies = await Movie.find().populate(
      "reviews.userId",
      "first_name last_name email",
    );
    let allReviews = [];
    movies.forEach((movie) => {
      movie.reviews.forEach((review) => {
        allReviews.push({
          ...review.toObject(),
          movieTitle: movie.title,
          movieId: movie._id,
        });
      });
    });
    return res.status(200).json({ reviews: allReviews });
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id: movieId, reviewId: reviewIdFromParams } = req.params;
    const reviewId = reviewIdFromParams || req.params.reviewId;

    let movie;
    if (movieId && ObjectId.isValid(movieId)) {
      movie = await Movie.findById(movieId);
    } else if (ObjectId.isValid(reviewId)) {
      movie = await Movie.findOne({ "reviews._id": reviewId });
    }

    if (!movie) {
      return res.status(404).json({ message: "Movie or Review not found" });
    }

    movie.reviews = movie.reviews.filter(
      (review) => review._id.toString() !== reviewId,
    );
    await movie.save();

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const updateReviewStatus = async (req, res) => {
  try {
    const { id: movieId, reviewId: reviewIdFromParams } = req.params;
    const reviewId = reviewIdFromParams || req.params.reviewId;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    let movie;
    if (movieId && ObjectId.isValid(movieId)) {
      movie = await Movie.findById(movieId);
    } else if (ObjectId.isValid(reviewId)) {
      movie = await Movie.findOne({ "reviews._id": reviewId });
    }

    if (!movie) {
      return res.status(404).json({ message: "Movie or Review not found" });
    }

    const review = movie.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.status = status;
    await movie.save();

    return res
      .status(200)
      .json({ message: `Review ${status} successfully`, review });
  } catch (error) {
    console.error("Error updating review status:", error);
    return res.status(400).json({ message: error.message });
  }
};
