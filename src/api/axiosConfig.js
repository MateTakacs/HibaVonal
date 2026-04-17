import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://localhost:7218",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

let hasHandledUnauthorizedRedirect = false;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 && !hasHandledUnauthorizedRedirect) {
      hasHandledUnauthorizedRedirect = true;
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.replace("/login");
      }

      setTimeout(() => {
        hasHandledUnauthorizedRedirect = false;
      }, 1000);
    }

    return Promise.reject(error);
  },
);
