import express from "express";
import {
  registerUser,
  loginUser,
  googleLoginUser,
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
import requireAdmin from "../middleware/requireAdmin.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/google-login", googleLoginUser);
userRouter.get("/search", getAllUsers);
userRouter.get("/me", protect, getCurrentUser);
userRouter.put("/update", protect, updateUser); // ✅ before /:id
userRouter.get("/admin/stats", protect, requireAdmin, getAdminStats); // ✅ before /:id
userRouter.get("/admin/users", protect, requireAdmin, getAllUsersForAdmin); // ✅ before /:id
userRouter.delete("/admin/users/:id", protect, requireAdmin, deleteUserByAdmin);
userRouter.get("/admin/analytics", protect, requireAdmin, getAdminAnalytics); // ✅ before /:id
userRouter.get("/:id", protect, getUserById);

export default userRouter;
