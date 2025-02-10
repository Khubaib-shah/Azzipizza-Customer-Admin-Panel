import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
} from "../controllers/userController.js";

// User registration
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// Get user profile
router.get("/profile", authMiddleware, getUserProfile);

// Update user profile
router.put("/profile", authMiddleware, updateUserProfile);

export default router;
