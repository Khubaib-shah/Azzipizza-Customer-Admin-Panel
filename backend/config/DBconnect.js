import mongoose from "mongoose";

export const DBconnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected successfully!");
  } catch (error) {
    console.error("DB connection error:", error);
  }
};
