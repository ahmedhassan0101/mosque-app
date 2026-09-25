import { z } from "zod";
// import { Types } from "mongoose";
import { PROGRESS_TRENDS, TAJWEED_RATINGS } from "@/constants";
import { rules } from "./common-rules";

// Helper function to validate MongoDB ObjectId
// const objectIdValidator = z
//   .string()
//   .refine((val) => Types.ObjectId.isValid(val), {
//     message: "معرف غير صالح",
//   });

export const monthlyReportSchema = z.object({
  // studentId: objectIdValidator,
  // mosqueId: objectIdValidator,

  // month in the format YYYY-MM
  month: z
    .string()
    .regex(
      /^\d{4}-(0[1-9]|1[0-2])$/,
      "تنسيق الشهر غير صالح (يجب أن يكون YYYY-MM)",
    ),
  progressTrend: rules.enum(PROGRESS_TRENDS.values, "يرجى تحديد مؤشر التقدم"),
  surahFrom: rules.surah,
  ayahFrom: rules.ayah,
  surahTo: rules.surah,
  ayahTo: rules.ayah,
  tajweed: rules.enum(TAJWEED_RATINGS.values, "يرجى تحديد تقييم التجويد"),
  notes: rules.note,
});

export type MonthlyReportInput = z.infer<typeof monthlyReportSchema>;
