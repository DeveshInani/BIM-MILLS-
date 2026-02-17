import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("userToken");

    // Logic: 
    // If route starts with /admin, use adminToken.
    // If it's an admin-specific API (like /api/sales or /admin), use adminToken.
    // Otherwise, prefer userToken, but fallback to adminToken if it's all we have.

    let token = userToken;

    if (config.url.startsWith("/admin") || config.url.startsWith("/api/sales")) {
      token = adminToken;
    } else if (!userToken) {
      token = adminToken;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
