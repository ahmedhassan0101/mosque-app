import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { api } from "@/lib/api/axios";
import { z } from "zod";

// --- Types (يمكن نقلها لملف منفصل) ---
export const loginSchema = z.object({
  email: z.email("بريد إلكتروني غير صحيح"),
  password: z.string().min(8, "كلمة المرور 8 أحرف على الأقل"),
});
export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    mosqueName: z.string().min(3, "اسم المسجد 3 أحرف على الأقل"),
    address: z.string().optional(),
    phone: z.string().optional(),
    adminName: z.string().min(2, "اسم المسؤول مطلوب"),
    email: z.email("بريد إلكتروني غير صحيح"),
    password: z.string().min(8, "كلمة المرور 8 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });
export type RegisterForm = z.infer<typeof registerSchema>;

// --- Hooks ---

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginForm) => {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(
          result.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        );
      }
      return result;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterForm) => {
      // Axios سيقوم برمي الخطأ تلقائياً بفضل الـ Interceptor لو فشل الطلب
      const response = await api.post("/api/auth/register", data);
      return response.data;
    },
  });
};
