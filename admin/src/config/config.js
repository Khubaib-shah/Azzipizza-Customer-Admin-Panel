import axios from "axios";

// Create an Axios instance with a base URL
export const baseUri = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
