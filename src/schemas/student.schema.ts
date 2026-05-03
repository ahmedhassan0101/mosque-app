import { z } from "zod";

/**
 * Guardian sub-schema — represents a parent/guardian contact.
 * Both fields are required: relation (e.g. "أب") and phone number.
 */

const guardianSchema = z.object({
  relation: z
    .string({ message: "صلة القرابة مطلوبة." })
    .min(1, "يرجى تحديد صلة القرابة (مثال: أب، أم)."),
  phone: z
    .string({ message: "رقم الهاتف مطلوب." })
    .min(10, "رقم الهاتف غير صحيح، يجب أن يكون 10 أرقام على الأقل."),
});

export const studentSchema = z.object({
  name: z
    .string({ message: "اسم الطالب مطلوب." })
    .min(2, "الاسم يجب أن يكون حرفين على الأقل.")
    .max(100, "الاسم طويل جداً، الحد الأقصى 100 حرف.")
    .trim(),

  birthDate: z
    .date({ message: "تاريخ الميلاد مطلوب." })
    .max(new Date(), { message: "تاريخ الميلاد لا يمكن أن يكون في المستقبل." }),

  gender: z.enum(["male", "female"], {
    message: "يرجى اختيار الجنس.",
  }),

  guardians: z
    .array(guardianSchema)
    .min(1, "يجب إضافة ولي أمر واحد على الأقل."),

  level: z.enum(["beginner", "intermediate", "advanced"], {
    message: "يرجى اختيار المستوى.",
  }),

  phone: z
    .string()
    .max(11, "رقم الهاتف طويل جداً.")
    .optional()
    .or(z.literal("")),
  image: z.url("رابط الصورة غير صالح.").optional().or(z.literal("")),
  address: z
    .string()
    .max(200, "العنوان طويل جداً.")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(500, "الملاحظات طويلة جداً.")
    .optional()
    .or(z.literal("")),

  currentSurah: z.string().optional().or(z.literal("")),
  currentAyah: z
    .number()
    .int("رقم الآية يجب أن يكون عدداً صحيحاً.")
    .min(1, "رقم الآية يبدأ من 1.")
    .optional(),
});

export type StudentInput = z.infer<typeof studentSchema>;
