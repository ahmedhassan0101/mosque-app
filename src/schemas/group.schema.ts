import z from "zod";

export const groupSchema = z.object({
  name: z.string().min(2, "اسم المجموعة مطلوب"),
  activity: z.enum(
    ["quran", "tarbiya", "tajweed", "maqraa", "playground"],
    "يرجى اختيار نوع النشاط",
  ),
  teacherId: z.string().min(1, "اختر شيخاً"),
  appointment: z.string().optional(),
  studentIds: z.array(z.string(), "يرجى اختيار الطلاب"), 
  notes: z.string().optional(),
});
export type GroupInput = z.infer<typeof groupSchema>;
