import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // يمكنك إضافة الـ Authorization Header هنا مستقبلاً
    // const token = getAuthToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (للتعامل مع الأخطاء بشكل مركزي)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // استخراج رسالة الخطأ من الباك إند
    const message = error.response?.data?.error || "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً";
    // يمكنك هنا عمل Logout تلقائي لو كان الـ Status 401
    return Promise.reject(new Error(message));
  }
);