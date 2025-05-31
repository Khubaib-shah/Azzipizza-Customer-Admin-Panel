import axios from "axios";
export const URL = import.meta.env.VITE_API_BASE_URL_PRO;

export const baseUri = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
    "X-Custom": "force-cors",
  },
});
