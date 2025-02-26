import axios from "axios";

// Create an Axios instance with a base URL
export const baseUri = axios.create({
  baseURL: "http://localhost:5000", // Local development URL
  // baseURL: "https://pizzeria-backend.vercel.app/api", // Production URL
  headers: {
    "Content-Type": "application/json",
  },
});
