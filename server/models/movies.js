import mongoose from "mongoose";

const moviesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  cast: {
    type: [String],
    required: true,
  },
  plot: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  backdrop: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
  },
  releaseYear: {
    type: Number,
    required: true,
  },
  genre: {
    type: [String],
    required: true,
  },
  runtime: {
    type: Number,
    required: true,
  },
  trailer: {
    type: String,
    required: false,
  },
  downloadLink: {
    type: String,
    required: false,
  },
  language: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // models/Movie.js — clean schema, no userName/userAvatar
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "approved",
      },
    },
  ],
});

const Movie = mongoose.model("Movie", moviesSchema);

export default Movie;
