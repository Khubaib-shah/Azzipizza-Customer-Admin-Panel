// create a base url here with axios
import axios from "axios";
export const baseUri = axios.create({
  baseURL: "https://pizzeria-backend.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});
