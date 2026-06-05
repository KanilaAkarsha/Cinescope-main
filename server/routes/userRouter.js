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
} from "../controllers/userControllers.js";
import protect from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", protect, getCurrentUser);
userRouter.get("/:id", protect, getUserById);
userRouter.put("/update", protect, updateUser);
userRouter.get("/admin/stats", protect, getAdminStats);
userRouter.get("/admin/users", protect, getAllUsersForAdmin);
userRouter.delete("/admin/users/:id", protect, deleteUserByAdmin);
userRouter.get("/admin/analytics", protect, getAdminAnalytics);

export default userRouter;
