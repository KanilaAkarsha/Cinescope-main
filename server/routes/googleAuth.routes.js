// routes/googleAuth.routes.js
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET;

// Step 1 — Frontend hits this → browser redirects to Google consent screen
// GET /api/users/login/google
router.get(
  "/login/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

// Step 2 — Google redirects back here after user approves
// GET /api/users/login/google/callback
router.get(
  "/login/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${CLIENT_URL}/login?error=Google+authentication+failed`,
  }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.avatar,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Redirect frontend — AuthHandler.jsx reads ?token= from the URL
    res.redirect(
      `${CLIENT_URL}/?token=${token}&message=${encodeURIComponent("Logged in with Google!")}`,
    );
  },
);

export default router;
