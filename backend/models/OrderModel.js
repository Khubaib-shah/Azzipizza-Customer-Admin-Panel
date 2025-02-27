import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: [true, "Item is required"],
        },
        quantity: { type: Number, required: true, default: 1 },
        customizations: [{ type: String }],
      },
    ],
    totalPrice: { type: Number, required: [true, "Total price is required"] },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Preparing", "Out for Delivery", "Delivered"],
      default: "Preparing",
    },
    name: { type: String },
    deliveryAddress: {
      street: { type: String, required: [true, "Street is required"] },
      city: { type: String, required: [true, "City Name is required"] },
      zipCode: { type: String, required: [true, "Zip code is required"] },
    },
    phoneNumber: { type: String, required: [true, "Phone Number is required"] },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
