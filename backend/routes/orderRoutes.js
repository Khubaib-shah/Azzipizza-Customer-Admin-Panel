import express from "express";
const router = express.Router();
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Get all orders (admin only)
router.get("/", authMiddleware, getAllOrders);

// Get orders for a specific user
router.get("/user/:userId", authMiddleware, getOrderById);

// Create a new order
router.post("/", authMiddleware, createOrder);

// Update order status by ID (admin only)
router.put("/:id", authMiddleware, updateOrderStatus);

// Delete an order by ID (admin only)
router.delete("/:id", authMiddleware, deleteOrder);

export default router;
