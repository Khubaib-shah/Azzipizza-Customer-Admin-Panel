import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    description: { type: String },
    price: { type: Number, required: [true, "Price is required"] },
    image: { type: String },
    category: {
      type: String,
      enum: ["Pizza", "Pasta", "Drinks", "Desserts"],
      required: [true, "Category is required"],
    },
    ingredients: [{ type: String }], // List of ingredients
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Menu = mongoose.model("Menu", menuSchema);
export default Menu;
