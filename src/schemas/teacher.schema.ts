// src/schemas/teacher.schema.ts
import { z } from "zod";
import { rules } from "./common-rules";

export const teacherSchema = z.object({
  name: rules.name,
  phone: rules.phone,
  image: rules.image,
  notes: rules.note,
});

export type TeacherInput = z.infer<typeof teacherSchema>;
