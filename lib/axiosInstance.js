import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const axiosMain = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach auth token to every request, unless explicitly skipped via { skipAuth: true }
axiosMain.interceptors.request.use((config) => {
  if (typeof window !== "undefined" && !config.skipAuth) {
    const token = localStorage.getItem("turfnext_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 — clear stale token
axiosMain.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("turfnext_token");
      localStorage.removeItem("turfnext_user");
    }
    return Promise.reject(err);
  }
);

export default axiosMain;
