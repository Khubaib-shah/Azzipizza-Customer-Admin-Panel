import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL_PRO_SOCKECT
// ||
// import.meta.env.VITE_API_BASE_URL_PRO ||
// import.meta.env.VITE_API_BASE_URL_DEV;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Custom": "force-cors",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "An unexpected error occurred";

    if (error.response?.status === 401) {
      console.warn("Unauthorized access - redirecting or clearing session");
    }

    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
      originalError: error,
    });
  }
);

export default apiClient;
