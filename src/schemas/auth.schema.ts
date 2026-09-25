// src\schemas\auth.schema.ts
import { z } from "zod";
import { rules } from "./common-rules";

export const registerSchema = z
  .object({
    name: rules.name,
    email: rules.email,
    password: rules.password,
    confirmPassword: z.string({ message: "تأكيد كلمة المرور مطلوب" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: rules.email,
  password: rules.requiredPassword,
});

export const forgotPasswordSchema = z.object({
  email: rules.email,
});

export const resetPasswordSchema = z.object({
  token: rules.token,
  password: rules.password,
});

export const resetPasswordFormSchema = z
  .object({
    password: rules.password,
    confirmPassword: z.string({ message: "تأكيد كلمة المرور مطلوب" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

/** Used to validate the raw token string from the URL */
export const verifyEmailSchema = z.object({
  // token: z.string().uuid("رمز التحقق غير صالح"),
  token: z.uuid({ message: "رمز التحقق غير صالح" }),
});

/** Used internally in the resend action */
export const resendVerificationSchema = z.object({
  email: rules.email,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
