import { z } from "zod";
import { rules } from "./common-rules";
import { GENDERS, LEVELS } from "@/constants";

const guardianSchema = z.object({
  relation: rules.relation,
  phone: rules.phone,
});

export const studentSchema = z.object({
  name: rules.name,
  birthDate: rules.date,
  gender: rules.enum(GENDERS.values, "يرجى اختيار الجنس."),
  guardians: z
    .array(guardianSchema)
    .min(1, "يجب إضافة ولي أمر واحد على الأقل."),
  level: rules.enum(LEVELS.values, "يرجى اختيار المستوى."),
  phone: rules.phone,
  image: rules.image,
  address: rules.optionalString,
  notes: rules.note,
  currentSurah: rules.optionalSurah,
  currentAyah: rules.optionalAyah,
  // currentSurah: z.string().optional().or(z.literal("")),
  // currentAyah: z
  //   .number()
  //   .int("رقم الآية يجب أن يكون عدداً صحيحاً.")
  //   .min(1, "رقم الآية يبدأ من 1.")
  //   .optional(),
});

export type StudentInput = z.infer<typeof studentSchema>;
