import axios from "axios";

// Environment variables for flexibility
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

// Request Interceptor: Add Auth Tokens or common headers here
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

// Response Interceptor: Standardize error responses and data extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error logging and formatting
    const message = error.response?.data?.message || error.message || "An unexpected error occurred";

    // We can handle specific status codes here (e.g., 401 for logout)
    if (error.response?.status === 401) {
      // Handle unauthorized (redirect to login if needed)
      console.warn("Unauthorized access - redirecting or clearing session");
    }

    // Wrap error in a standard format so services don't need to try/catch axios structure every time
    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
      originalError: error,
    });
  }
);

export default apiClient;
