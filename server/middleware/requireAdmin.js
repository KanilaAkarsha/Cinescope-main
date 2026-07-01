import users from "../models/users.js";

const requireAdmin = async (req, res, next) => {
  try {
    const user = await users.findById(req.userId).select("role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default requireAdmin;