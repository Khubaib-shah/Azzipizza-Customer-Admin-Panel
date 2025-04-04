import axios from "axios";

export const URL =
  import.meta.env.VITE_API_BASE_URL_PRO ||
  import.meta.env.VITE_API_BASE_URL_DEV;

export const baseUri = axios.create({
  baseURL: URL ?? "https://pizzeria-backend-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});
