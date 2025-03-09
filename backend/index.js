import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
dotenv.config();
import connectDB from "./config/DBconnect.js";

// Import routes
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import { Server } from "socket.io";
import Order from "./models/OrderModel.js";

connectDB();

// middleware
const app = express();
const server = createServer(app);

app.use(express());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());
app.use(errorMiddleware);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
export const sendUpdatedOrders = async () => {
  try {
    const orders = await Order.find().populate(
      "items.menuItem",
      "name price category"
    );

    orders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`);
      order.items.forEach((item, i) => {
        if (item.menuItem) {
          console.log(
            `  Item ${i + 1}: ${item.menuItem.name} - $${
              item.menuItem.price
            } (${item.menuItem.category}) x${item.quantity}`
          );
        } else {
          console.log(`  Item ${i + 1}: ⚠️ Missing menuItem reference!`);
        }
      });
    });

    io.emit("latestOrders", orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

// Use routes
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
// app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
