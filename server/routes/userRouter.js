import express from "express";
import {
  registerUser,
  loginUser,
  getUserById,
  getCurrentUser,
  updateUser,
  getAdminStats,
  getAllUsersForAdmin,
  deleteUserByAdmin,
  getAdminAnalytics,
  getAllUsers,
} from "../controllers/userControllers.js";
import protect from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/search", getAllUsers);
userRouter.get("/me", protect, getCurrentUser);
userRouter.put("/update", protect, updateUser); // ✅ before /:id
userRouter.get("/admin/stats", protect, getAdminStats); // ✅ before /:id
userRouter.get("/admin/users", protect, getAllUsersForAdmin); // ✅ before /:id
userRouter.delete("/admin/users/:id", protect, deleteUserByAdmin);
userRouter.get("/admin/analytics", protect, getAdminAnalytics); // ✅ before /:id
userRouter.get("/:id", protect, getUserById);

export default userRouter;
