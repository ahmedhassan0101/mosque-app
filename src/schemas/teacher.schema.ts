import z from "zod";

export const teacherSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  phone: z.string().optional(),
  image: z.string().optional(),
  notes: z.string().optional(),
})

export type TeacherInput = z.infer<typeof teacherSchema>;