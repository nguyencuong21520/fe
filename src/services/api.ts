import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// Base API URL - có thể lấy từ environment variable
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api/v1";

// Tạo axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - thêm token vào header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi chung
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Xử lý lỗi 401 (Unauthorized) - token hết hạn
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
