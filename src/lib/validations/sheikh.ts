import { z } from "zod";

export const sheikhSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  phone: z.string().optional(),
  // groupId: z.string().optional(), // to be deleted after refactoring
  photo: z.string().optional(),
  notes: z.string().optional(),
});

export type SheikhFormData = z.infer<typeof sheikhSchema>;

