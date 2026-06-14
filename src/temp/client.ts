import axios from "axios";
import { parseAxiosError } from "./errors-one";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(parseAxiosError(error)),
);

// Response interceptor — يحوّل كل error لـ AppError
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const appError = parseAxiosError(error);
    // لو 401 → redirect للـ login (في client components)
    if (appError.code === "UNAUTHORIZED" && typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return Promise.reject(appError);
  },
);
