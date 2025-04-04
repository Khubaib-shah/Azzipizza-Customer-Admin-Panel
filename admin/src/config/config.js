import axios from "axios";
export const URL =
  import.meta.env.VITE_API_BASE_URL_DEV ||
  import.meta.env.VITE_API_BASE_URL_PRO;
// Create an Axios instance with a base URL
export const baseUri = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
});
