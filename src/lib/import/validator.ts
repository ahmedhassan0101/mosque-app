import { z } from "zod";

const ACTIVITIES = [
  "quran",
  "tarbiya",
  "tajweed",
  "maqraa",
  "playground",
] as const;
const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const GENDERS = ["male", "female"] as const;

/**
 * Zod schema for a single import row.
 * Coerces empty strings to undefined for optional fields.
 */
export const importRowSchema = z.object({
  name: z
    .string({ message: "الاسم مطلوب" })
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(100),

  gender: z.enum(GENDERS, {
    message: "الجنس يجب أن يكون male أو female",
  }),

  birthDate: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined))
    .refine(
      (d) => !d || !isNaN(d.getTime()),
      "تاريخ الميلاد غير صحيح، استخدم صيغة YYYY-MM-DD",
    ),

  level: z.enum(LEVELS, {
    message: "المستوى يجب أن يكون beginner أو intermediate أو advanced",
  }),

  phone: z.string().optional(),
  guardianName: z.string().optional(),

  guardianPhone: z
    .string({ message: "تليفون ولي الأمر مطلوب" })
    .min(10, "رقم التليفون يجب أن يكون 10 أرقام على الأقل"),

  guardianPhone2: z.string().optional(),
  address: z.string().optional(),

  enrollments: z
    .string({ message: "الأنشطة مطلوبة" })
    .transform((v) =>
      v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    )
    .pipe(
      z
        .array(
          z.enum(ACTIVITIES, {
            message: "نشاط غير صحيح",
          }),
        )
        .min(1, "يجب اختيار نشاط واحد على الأقل"),
    ),

  trackIbadah: z
    .string()
    .optional()
    .transform((v) => v?.toLowerCase() === "true"),

  currentSurah: z.string().optional(),
  currentAyah: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .refine(
      (n) => n === undefined || (!isNaN(n) && n > 0),
      "رقم الآية يجب أن يكون رقماً موجباً",
    ),

  notes: z.string().optional(),
});

export type ImportRow = z.infer<typeof importRowSchema>;
export type ImportInput = z.input<typeof importRowSchema>;

// ── Row validation result ────────────────────────────────────────────────
export type RowResult =
  | { row: number; status: "valid"; data: ImportRow }
  | { row: number; status: "invalid"; errors: string[] };

/**
 * Validates all rows and returns per-row results.
 * Never throws — always returns structured results.
 */
export function validateRows(rawRows: ImportInput[]): RowResult[] {
  return rawRows.map((raw, index) => {
    const row = index + 2; // +2 because row 1 = header
    const result = importRowSchema.safeParse(raw);

    if (result.success) {
      return { row, status: "valid", data: result.data };
    }

    const errors = result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`,
    );
    return { row, status: "invalid", errors };
  });
}
