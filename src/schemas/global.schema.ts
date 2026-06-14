// src\schemas\global.schema.ts
import { ACTIVITIES } from "@/constants";
import { z } from "zod";

export const activitySchema = z.enum(ACTIVITIES.values, {
  message: "يرجى اختيار نوع النشاط.",
});

export const nameSchema =   z
    .string({ message: "الاسم مطلوب" })
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(100, "الاسم طويل جداً، الحد الأقصى 100 حرف.")
    .trim()

  export const dateSchema = z
  .date({ message: "التاريخ مطلوب." })
  .max(new Date(), { message: "لا يمكن اختيار تاريخ في المستقبل." });

export const noteSchema = z
  .string()
  .max(1000, "الملاحظات طويلة جداً.")
  .optional()
  .or(z.literal(""));

export const stringSchema = z.string().max(200).optional().or(z.literal(""))
export const ayahSchema = z
  .number()
  .int("رقم الآية يجب أن يكون عدداً صحيحاً.")
  .min(1, "رقم الآية يبدأ من 1.")
  .optional();

