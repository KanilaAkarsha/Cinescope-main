import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const safeUser = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete safeUser.password;

  // Ensure consistency between avatar and profilePicture
  if (safeUser.avatar && !safeUser.profilePicture) {
    safeUser.profilePicture = safeUser.avatar;
  } else if (safeUser.profilePicture && !safeUser.avatar) {
    safeUser.avatar = safeUser.profilePicture;
  }

  return safeUser;
};