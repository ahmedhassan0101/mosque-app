// src\schemas\onboarding.schema.ts
import { z } from "zod";
import { nameSchema } from "./global.schema";

export const createMosqueSchema = z.object({
  name: nameSchema,
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