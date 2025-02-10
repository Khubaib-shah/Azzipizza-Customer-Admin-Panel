import express from "express";
const router = express.Router();
import {
  createMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
} from "../controllers/menuController.js";

// Get all menu items
router.get("/", getAllMenuItems);

// Get a single menu item by ID
router.get("/:id", getMenuItemById);

// Create a new menu item
router.post("/", createMenuItem);

// Update a menu item by ID
router.put("/:id", updateMenuItem);

// Delete a menu item by ID
router.delete("/:id", deleteMenuItem);

export default router;
