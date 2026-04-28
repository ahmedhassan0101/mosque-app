"use server";

import {
  fail,
  firstZodIssue,
  handleActionError,
  ok,
  type ActionResponse,
} from "@/lib/action-response";
import { getMosqueId } from "@/lib/auth/get-context";
import { connectDB } from "@/lib/db/db";
import Student from "@/models/student.model";
import { StudentInput, studentSchema } from "@/schemas/student.schema";
import { revalidatePath } from "next/cache";

export async function saveStudent(
  data: StudentInput,
  id?: string,
): Promise<ActionResponse> {
  // 1. Validation (Zod)
  const parsed = studentSchema.safeParse(data);
  if (!parsed.success) return fail(firstZodIssue(parsed.error));

  try {
    // 2. Auth & Connection
    const mosqueId = await getMosqueId();
    await connectDB();

    // 3. Execution
    if (id) {
      // Update: نضمن أن الطالب ينتمي لنفس المسجد أمنياً
      const updated = await Student.findOneAndUpdate(
        { _id: id, mosqueId },
        { $set: parsed.data },
        { new: true, runValidators: true },
      );
      if (!updated) return fail("الطالب غير موجود أو لا تملك صلاحية تعديله.");
    } else {
      // Create
      await Student.create({ ...parsed.data, mosqueId });
    }

    // 4. Cache Invalidation
    revalidatePath("/dashboard/students");
    if (id) revalidatePath(`/dashboard/students/${id}`);

    return ok(
      undefined,
      id ? "تم تحديث بيانات الطالب بنجاح." : "تم تسجيل الطالب بنجاح.",
    );
  } catch (error) {
    return handleActionError(error, "saveStudent");
  }
}

export async function deleteStudent(id: string): Promise<ActionResponse> {
  try {
    const mosqueId = await getMosqueId();
    await connectDB();

    const deleted = await Student.findOneAndDelete({ _id: id, mosqueId });

    if (!deleted) return fail("الطالب غير موجود أو لا تملك صلاحية حذفه.");

    revalidatePath("/dashboard/students");
    return ok(undefined, "تم حذف سجل الطالب بنجاح.");
  } catch (error) {
    return handleActionError(error, "deleteStudent");
  }
}
