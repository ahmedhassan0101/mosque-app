// src\schemas\onboarding.schema.ts
import { z } from "zod";

export const createMosqueSchema = z.object({
  name: z.string().min(3, "اسم المسجد يجب أن يكون 3 أحرف على الأقل"),
  address: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
  phone: z
    .string()
    .regex(/^[0-9+\-\s]{7,15}$/, "رقم هاتف غير صالح"),
});

export const joinMosqueSchema = z.object({
  inviteCode: z.string().min(6, "رمز الدعوة غير صالح"),
});

export type CreateMosqueInput = z.infer<typeof createMosqueSchema>;
export type JoinMosqueInput = z.infer<typeof joinMosqueSchema>;