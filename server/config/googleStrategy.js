// config/googleStrategy.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/users/login/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const firstName =
          profile.name?.givenName || profile.displayName || "User";
        const lastName = profile.name?.familyName || "";
        const avatar = profile.photos[0]?.value || "";
        const googleId = profile.id;

        let user = await User.findOne({ email });

        if (!user) {
          // Brand new user — create with no password
          user = await User.create({
            first_name: firstName,
            last_name: lastName,
            email,
            googleId,
            avatar,
            authProvider: "google",
            // password left as null (default) — comparePassword handles this safely
          });
        } else if (!user.googleId) {
          // Existing email/password user — link their Google account
          user.googleId = googleId;
          user.authProvider = "google";
          user.avatar = user.avatar || avatar;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

export default passport;
