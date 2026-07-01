import express from "express";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import movieRouter from "./routes/movieRouter.js";
import uploadRouter from "./routes/uploadRouter.js";
import passport from "passport";

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "https://cinescope-main.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(passport.initialize());

app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/upload", uploadRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

export default app;
