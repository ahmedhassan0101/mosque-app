// // H:\mosque-app\src\schemas\teacher.schema.ts
// import z from "zod";

// export const teacherSchema = z.object({
//   name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
//   phone: z.string().optional(),
//   image: z.string().optional(),
//   notes: z.string().optional(),
// })

// export type TeacherInput = z.infer<typeof teacherSchema>;

// src/schemas/teacher.schema.ts
import { z } from "zod";
import { nameSchema } from "./global.schema";

/**
 * Teacher form validation schema.
 *
 * Design decisions:
 * - Optional string fields use `.optional()` (not `.nullable()`) because HTML
 *   inputs always return "" or undefined — never null. Keeping null out of
 *   the schema prevents the Zod/Mongoose/HTML mismatch bug.
 * - Empty strings are intentionally allowed for optional fields (phone, notes)
 *   because clearing a field is a valid user action during edit.
 * - `image` is a URL string injected by the upload component; the user never
 *   types it manually.
 */
export const teacherSchema = z.object({
  name: nameSchema,

  phone: z
    .string()
    .max(11, "رقم الهاتف طويل جداً.")
    .optional()
    .or(z.literal("")),

  image: z.url("رابط الصورة غير صالح.").optional().or(z.literal("")),

  notes: z
    .string()
    .max(500, "الملاحظات طويلة جداً، الحد الأقصى 500 حرف.")
    .optional()
    .or(z.literal("")),
});

export type TeacherInput = z.infer<typeof teacherSchema>;
