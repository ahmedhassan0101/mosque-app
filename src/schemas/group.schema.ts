// src\schemas\group.schema.ts
import { ACTIVITIES } from "@/constants";
import z from "zod";
import { nameSchema } from "./global.schema";

export const groupSchema = z.object({
  name: nameSchema,
  activity: z.enum(ACTIVITIES.values, {
    message: "يرجى اختيار نوع النشاط.",
  }),
  teacherId: z.string().min(1, "يرجى اختيار المعلم المسؤول."),
  appointment: z.string().min(2, "موعد المجموعة مطلوب"),
  studentIds: z.array(z.string(), "يرجى اختيار الطلاب"),
  notes: z
    .string()
    .max(500, "الملاحظات طويلة جداً.")
    .optional()
    .or(z.literal("")),
});
export type GroupInput = z.infer<typeof groupSchema>;
