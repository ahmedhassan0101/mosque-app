// src\schemas\group.schema.ts
import { ACTIVITIES } from "@/types";
import z from "zod";

export const groupSchema = z.object({
  name: z
    .string({ message: "اسم المجموعة مطلوب." })
    .min(2, "اسم المجموعة يجب أن يكون حرفين على الأقل.")
    .max(100, "اسم المجموعة طويل جداً.")
    .trim(),

  activity: z.enum(ACTIVITIES, {
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
