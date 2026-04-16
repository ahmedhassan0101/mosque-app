// import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { api } from "@/lib/api/axios";
import { z } from "zod";
import { parseAxiosError } from "@/lib/errors";

// // --- Types (يمكن نقلها لملف منفصل) ---
// export const loginSchema = z.object({
//   email: z.email("بريد إلكتروني غير صحيح"),
//   password: z.string().min(8, "كلمة المرور 8 أحرف على الأقل"),
// });
// export type LoginForm = z.infer<typeof loginSchema>;

// export const registerSchema = z
//   .object({
//     mosqueName: z.string().min(3, "اسم المسجد 3 أحرف على الأقل"),
//     address: z.string().optional(),
//     phone: z.string().optional(),
//     adminName: z.string().min(2, "اسم المسؤول مطلوب"),
//     email: z.email("بريد إلكتروني غير صحيح"),
//     password: z.string().min(8, "كلمة المرور 8 أحرف على الأقل"),
//     confirmPassword: z.string(),
//   })
//   .refine((d) => d.password === d.confirmPassword, {
//     message: "كلمتا المرور غير متطابقتين",
//     path: ["confirmPassword"],
//   });
// export type RegisterForm = z.infer<typeof registerSchema>;
// ── Schemas ────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.email("بريد إلكتروني غير صحيح"),
  password: z.string().min(8, "كلمة المرور 8 أحرف على الأقل"),
});
export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.email("بريد إلكتروني غير صحيح"),
  password: z.string().min(8, "كلمة المرور 8 أحرف على الأقل"),
});
export type RegisterForm = z.infer<typeof registerSchema>;
export const onboardingSchema = z.object({
  mosqueName: z.string().min(3, "اسم المسجد 3 أحرف على الأقل"),
  address: z.string().optional(),
  phone: z.string().optional(),
});
export type OnboardingForm = z.infer<typeof onboardingSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email("بريد إلكتروني غير صحيح"),
});
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "كلمة المرور 8 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

// ── Auth functions ─────────────────────────────────────────────
/**
 * Login with email + password via NextAuth credentials provider.
 * Returns error string or null on success.
 */
export async function loginWithCredentials(
  data: LoginForm,
  callbackUrl = "/",
): Promise<string | null> {
  const result = await signIn("credentials", {
    ...data,
    redirect: false,
    callbackUrl,
  });

  if (result?.error) {
    return "البريد الإلكتروني أو كلمة المرور غير صحيحة";
  }
  return null;
}
/**
 * Register new user (credentials) — no mosque at this step.
 * Returns error string or null on success.
 */

export async function registerUser(data: RegisterForm): Promise<string | null> {
  try {
    await api.post("/api/auth/register", data);
    return null;
  } catch (err) {
    return parseAxiosError(err);
  }
}

/**
 * Complete mosque onboarding after first login.
 * Must call update() from useSession() after success to refresh JWT.
 */
export async function completeOnboarding(
  data: OnboardingForm,
): Promise<string | null> {
  try {
    await api.post("/api/onboarding", data);
    return null;
  } catch (err) {
    return parseAxiosError(err);
  }
}

/**
 * Send forgot password email.
 */
export async function sendForgotPassword(
  data: ForgotPasswordForm,
): Promise<string | null> {
  try {
    await api.post("/api/auth/forgot-password", data);
    return null;
  } catch (err) {
    return parseAxiosError(err);
  }
}

/**
 * Reset password with token from URL.
 */
export async function resetPassword(
  token: string,
  data: ResetPasswordForm,
): Promise<string | null> {
  try {
    await api.post("/api/auth/reset-password", {
      token,
      password: data.password,
    });
    return null;
  } catch (err) {
    return parseAxiosError(err);
  }
}

// export const useLogin = () => {
//   return useMutation({
//     mutationFn: async (data: LoginForm) => {
//       const result = await signIn("credentials", {
//         ...data,
//         redirect: false,
//       });

//       if (result?.error) {
//         throw new Error(
//           result.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
//         );
//       }
//       return result;
//     },
//   });
// };

// export const useRegister = () => {
//   return useMutation({
//     mutationFn: async (data: RegisterForm) => {
//       // Axios سيقوم برمي الخطأ تلقائياً بفضل الـ Interceptor لو فشل الطلب
//       const response = await api.post("/api/auth/register", data);
//       return response.data;
//     },
//   });
// };
