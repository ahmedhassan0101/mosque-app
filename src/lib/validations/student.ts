import { z } from "zod";

export const ACTIVITIES = [
  "quran",
  "tarbiya",
  "tajweed",
  "maqraa",
  "playground",
] as const;

export const studentSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(100),
  // birthDate: z.date(),
  // birthDate: z.union([z.date(), z.number()]),
  birthDate: z.coerce.date({
    message: "تاريخ الميلاد مطلوب",
  }),
  gender: z.enum(["male", "female"]),
  phone: z.string().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().min(10, "رقم ولي الأمر مطلوب"),
  guardianPhone2: z.string().optional(),
  address: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  enrollments: z.array(z.enum(ACTIVITIES)).min(1, "اختر نشاط واحد على الأقل"),
  trackIbadah: z.boolean(),
  currentSurah: z
    .string({ message: "السورة الحالية مطلوبة" })
    .min(1, "اختر السورة"),

  currentAyah: z
    .number({
      message: "رقم الآية مطلوب",
    })
    .min(1, "رقم الآية يجب أن يكون 1 أو أكثر"),
  notes: z.string().optional(),
});

export type StudentFormData = z.input<typeof studentSchema>;
