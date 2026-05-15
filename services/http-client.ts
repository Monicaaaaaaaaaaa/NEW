 import config from "@/config";
import axios, { AxiosInstance } from "axios";

console.log("Config API Base URL:", config.apiBaseUrl);
console.log("NEXT_PUBLIC_API_BASE_URL env:", process.env.NEXT_PUBLIC_API_BASE_URL);

const HTTP: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl || "http://172.17.10.79:9000/api/v1",
  timeout: config.httpTimeout,
  headers: { "Content-Type": "application/json" },
});

// ========================
// Helper
// ========================
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

// ========================
// Request Interceptor
// ========================
HTTP.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========================
// Response Interceptor
// ========================
HTTP.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default HTTP;