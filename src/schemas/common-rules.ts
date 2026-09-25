// src/schemas/common-rules.ts
import { z } from "zod";
import { ACTIVITIES, BEHAVIORS } from "@/constants";

export const rules = {
  name: z
    .string({ message: "الاسم مطلوب" })
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(100, "الاسم طويل جداً، الحد الأقصى 100 حرف.")
    .trim(),

  email: z
    .string({ message: "البريد الإلكتروني غير صالح" })
    .trim()
    .min(1, "يرجى إدخال البريد الإلكتروني")
    .pipe(z.email({ message: "البريد الإلكتروني غير صالح" })),

  password: z
    .string({ message: "كلمة المرور مطلوبة" })
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),

  requiredPassword: z
    .string({ message: "كلمة المرور مطلوبة" })
    .min(1, "كلمة المرور مطلوبة"),
  token: z.string({ message: "رمز التحقق مطلوب" }).min(1, "رمز التحقق مطلوب"),

  phone: z
    .string({ message: "رقم الهاتف مطلوب" })
    .trim()
    .regex(/^[0-9+\-\s]{7,15}$/, "رقم هاتف غير صالح"),

  image: z.url("رابط الصورة غير صالح.").optional().or(z.literal("")),

  relation: z
    .string({ message: "صلة القرابة مطلوبة." })
    .min(1, "يرجى تحديد صلة القرابة (مثال: أب، أم).")
    .trim(),

  address: z
    .string({ message: "العنوان مطلوب" })
    .min(5, "العنوان يجب أن يكون 5 أحرف على الأقل")
    .trim(),

  inviteCode: z
    .string({ message: "رمز الدعوة مطلوب" })
    .trim()
    .min(6, "رمز الدعوة غير صالح"),

  id: z.string({ message: "المعرّف مطلوب" }).min(1, "المعرّف مطلوب"),

  date: z
    .date({ message: "التاريخ مطلوب." })
    .max(new Date(), { message: "لا يمكن اختيار تاريخ في المستقبل." }),

  note: z
    .string()
    .max(500, "يجب ألا تتجاوز الملاحظات 500 حرف")
    .optional()
    .or(z.literal("")),

  optionalString: z.string().max(200).optional().or(z.literal("")),

  surah: z
    .string("اسم السورة مطلوب")
    .min(2, "اسم السورة قصير جداً")
    .max(50, "اسم السورة طويل جداً")
    .trim(),

  optionalSurah: z
    .string("اسم السورة مطلوب")
    .min(2, "اسم السورة قصير جداً")
    .max(50, "اسم السورة طويل جداً")
    .trim()
    .optional(),

  ayah: z // z.coerce
    .number()
    .int("رقم الآية يجب أن يكون عدداً صحيحاً.")
    .min(1, "رقم الآية يبدأ من 1."),

  optionalAyah: z // z.coerce
    .number()
    .int("رقم الآية يجب أن يكون عدداً صحيحاً.")
    .min(1, "رقم الآية يبدأ من 1.")
    .optional(),
  // activity: z.enum(ACTIVITIES.values, {
  //   message: "يرجى اختيار نوع النشاط.",
  // }),

  activity: z.enum(ACTIVITIES.values as [string, ...string[]], {
    message: "يرجى اختيار نوع النشاط.",
  }),
  behaviorTag: z.enum(BEHAVIORS.values, {
    message: "تصنيف غير صالح.",
  }),

  enum: <T extends string>(values: T[] | readonly T[], message: string) =>
    z.enum(values as [T, ...T[]], {
      message,
    }),
};
