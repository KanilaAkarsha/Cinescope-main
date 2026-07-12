import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const userObj = typeof user.toObject === "function" ? user.toObject() : { ...user };
  const safeUser = { ...userObj };
  delete safeUser.password;

  // Function to check if a URL is a temporary blob URL
  const isInvalidUrl = (url) => {
    return typeof url === "string" && (url.startsWith("blob:") || url.startsWith("data:"));
  };

  // Clean up any temporary blob or data URLs that might have leaked into the database
  if (isInvalidUrl(safeUser.profilePicture)) {
    safeUser.profilePicture = "";
  }
  if (isInvalidUrl(safeUser.avatar)) {
    safeUser.avatar = "";
  }
  if (isInvalidUrl(safeUser.cloudinary_id)) {
    safeUser.cloudinary_id = null;
  }

  // Ensure consistency between avatar and profilePicture
  if (safeUser.avatar && !safeUser.profilePicture) {
    safeUser.profilePicture = safeUser.avatar;
  } else if (safeUser.profilePicture && !safeUser.avatar) {
    safeUser.avatar = safeUser.profilePicture;
  }

  return safeUser;
};