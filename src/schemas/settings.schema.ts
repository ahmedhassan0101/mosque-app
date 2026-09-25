import { z } from "zod";
import { rules } from "./common-rules";

export const updateMosqueSchema = z.object({
  name: rules.name,
  address: rules.address,
  phone: rules.phone,
});

export const updateUserRoleSchema = z.object({
  userId: rules.id,
  newRole: rules.enum(["ADMIN", "SUPERVISOR"], "يرجى اختيار الصلاحية المطلوبة"),
});

export const removeUserSchema = z.object({
  userId: rules.id,
});

export const resetPasswordSchema = z
  .object({
    token: rules.token,
    password: rules.password,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export type UpdateMosqueInput = z.infer<typeof updateMosqueSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
