import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/DBconnect.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import Order from "./models/OrderModel.js";

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Parse allowed origins from environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
console.log("Allowed origins:", allowedOrigins);

// Initialize Express app and HTTP server
const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Error middleware
app.use(errorMiddleware);

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Function to send updated orders to clients
export const sendUpdatedOrders = async () => {
  try {
    const orders = await Order.find().populate(
      "items.menuItem",
      "name price category"
    );

    // Log orders for debugging
    orders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`);
      order.items.forEach((item, i) => {
        if (item.menuItem) {
          console.log(
            `  Item ${i + 1}: ${item.menuItem.name} - $${
              item.menuItem.price * item.quantity
            } (${item.menuItem.category}) x${item.quantity}`
          );
        } else {
          console.log(`  Item ${i + 1}: ⚠️ Missing menuItem reference!`);
        }
      });
    });

    // Emit updated orders to all connected clients
    io.emit("latestOrders", orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

// Routes
app.get("/", (req, res) => {
  res.send("API is running");
});
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
