// src\schemas\group.schema.ts
import z from "zod";
import { rules } from "./common-rules";

export const groupSchema = z.object({
  name: rules.name,
  activity: rules.activity,
  teacherId: z.string().min(1, "يرجى اختيار المعلم المسؤول."),
  appointment: z
    .string({ message: "موعد المجموعة مطلوب" })
    .min(2, "موعد المجموعة مطلوب")
    .trim(),
  studentIds: z.array(z.string(), "يرجى اختيار الطلاب"),
  notes: rules.note,
});
export type GroupInput = z.infer<typeof groupSchema>;
