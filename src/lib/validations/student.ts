import { z } from "zod";

export const studentSchema = z.object({
  name:           z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(100),
  birthYear:      z.number().min(2000).max(new Date().getFullYear()),
  phone:          z.string().optional(),
  guardianName:   z.string().optional(),
  guardianPhone:  z.string().min(10, "رقم ولي الأمر مطلوب"),
  guardianPhone2: z.string().optional(),
  address:        z.string().optional(),
  level:          z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  enrollments: z.array(
    z.enum(["quran", "tarbiya", "tajweed", "maqraa", "playground"])
  ).default(["quran", "tarbiya", "playground"]),
  trackIbadah:  z.boolean().default(false),
  currentSurah: z.string().optional(),
  currentAyah:  z.number().optional(),
  notes:        z.string().optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;