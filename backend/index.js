import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DBconnect } from "./config/DBconnect.js";

dotenv.config();

DBconnect();
const app = express();
app.use(express());
app.use(cors());
app.use(express.json());

app.use("/", (req, res) => {
  res.status(200).json({
    message: "api is working",
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
