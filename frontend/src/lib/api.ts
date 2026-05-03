import axios from "axios";
import toast from "react-hot-toast";

// Clean API_URL: remove trailing slash if present
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

if (!API_URL && typeof window !== "undefined") {
  console.warn("NEXT_PUBLIC_API_URL is not defined. API calls may fail.");
}

const API = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000, // 30s timeout for cold starts
});

// Request Interceptor
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global Error Handling
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error?.message || "An unexpected error occurred";

      if (status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
            window.location.href = '/login';
          }
        }
      } else if (status === 403) {
        toast.error("You don't have permission to perform this action");
      } else if (status === 503 || status === 504) {
        toast.error("Server is waking up... Please wait a few seconds and try again.");
      } else if (status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(message);
      }
    } else if (error.code === 'ECONNABORTED') {
      toast.error("Request timed out. The server might be waking up.");
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    } else {
      console.error("API Error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default API;
