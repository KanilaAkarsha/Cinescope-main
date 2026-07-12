import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.warn(`Auth failed: No Authorization header present for ${req.method} ${req.originalUrl}`);
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // If token is "Bearer xxx"
    const token = authHeader.split(" ")[1];

    if (!token) {
      console.warn(`Auth failed: Malformed Authorization header for ${req.method} ${req.originalUrl}`);
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret",
    );

    if (!decoded.userId) {
      console.warn(`Auth failed: Token missing userId for ${req.method} ${req.originalUrl}`);
      return res.status(401).json({ message: "Invalid token" });
    }

    req.userId = decoded.userId; // MUST match generateToken
    next();
  } catch (error) {
    console.error(`Auth failed: ${error.message} for ${req.method} ${req.originalUrl}`);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default protect;
