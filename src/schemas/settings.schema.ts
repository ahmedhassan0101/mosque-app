import { z } from "zod";
// import { UserRole } from "@/types";
// export type UserRole = "SUPER_ADMIN" | "ADMIN" | "SUPERVISOR";
export const updateMosqueSchema = z.object({
  name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  address: z.string().min(5, "العنوان مطلوب"),
  phone: z.string().regex(/^[0-9+\-\s]{7,15}$/, "رقم هاتف غير صالح"),
});

export const updateUserRoleSchema = z.object({
  userId: z.string().min(1),
  newRole: z.enum(["ADMIN", "SUPERVISOR"] as const),
});

export const removeUserSchema = z.object({
  userId: z.string().min(1),
});



export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export type UpdateMosqueInput = z.infer<typeof updateMosqueSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
