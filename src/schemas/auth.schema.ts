// src\schemas\auth.schema.ts
import { z } from "zod";
import { nameSchema } from "./global.schema";

export const registerSchema = z
  .object({
    name: nameSchema,
    email: z.email("بريد إلكتروني غير صالح"),
    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email("بريد إلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});
export const forgotPasswordSchema = z.object({
  email: z.email("بريد إلكتروني غير صالح"),
});
export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});
export const resetPasswordFormSchema = z
  .object({
    password: z.string().min(8, "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

  /** Used to validate the raw token string from the URL */
export const verifyEmailSchema = z.object({
  token: z.string().uuid("رمز التحقق غير صالح"),
});

/** Used internally in the resend action */
export const resendVerificationSchema = z.object({
  email: z.email("بريد إلكتروني غير صالح"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;