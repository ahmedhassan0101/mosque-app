import { z } from "zod";

export const ACTIVITIES = [
  "quran",
  "tarbiya",
  "tajweed",
  "maqraa",
  "playground",
] as const;

const guardianInputSchema = z.object({
  relation: z.string().min(1, "يرجى تحديد صلة القرابة (مثال: أب، أم)"),
  phone: z.string().min(10, "رقم الهاتف غير صحيح"),
});

export const studentSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(100),
 
  birthDate: z.date({
    message: "تاريخ الميلاد مطلوب",
  }),
  gender: z.enum(["male", "female"], "يرجى اختيار النوع"),
  guardians: z
    .array(guardianInputSchema)
    .min(1, "يجب إضافة وسيلة تواصل واحدة على الأقل"),

  level: z.enum(["beginner", "intermediate", "advanced"], "يرجى اختيار المستوى"),

  currentSurah: z.string().min(1, "يرجى اختيار السورة"),

  currentAyah: z.number().min(1, "رقم الآية يبدأ من 1").optional(),

  phone: z.string().optional(),
  address: z.string().optional(),
  image: z.string().optional(),
  notes: z.string().optional(),
});

export type StudentInput = z.infer<typeof studentSchema>;
