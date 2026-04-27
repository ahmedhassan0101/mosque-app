// src\actions\teacher.actions.ts
"use server";

import {
  fail,
  firstZodIssue,
  handleActionError,
  ok,
} from "@/lib/action-response";
import { getMosqueId } from "@/lib/auth/get-context";
import { connectDB } from "@/lib/db/db";
import Teacher from "@/models/teacher.mode";
import { TeacherInput, teacherSchema } from "@/schemas/teacher.schema";
import { revalidatePath } from "next/cache";

import type { ActionResponse } from "@/lib/action-response";

export async function saveTeacher(
  data: TeacherInput,
  id?: string,
): Promise<ActionResponse> {
  // 1. Validation
  const parsed = teacherSchema.safeParse(data);
  if (!parsed.success) return fail(firstZodIssue(parsed.error));

  try {
    // 2. Auth & DB
    const mosqueId = await getMosqueId();
    await connectDB();

    // 3. Execution
    if (id) {
      // Update
      const updated = await Teacher.findOneAndUpdate(
        { _id: id, mosqueId },
        { $set: parsed.data },
        { new: true, runValidators: true },
      );
      if (!updated) return fail("المعلم غير موجود أو لا تملك صلاحية تعديله.");
    } else {
      // Create
      await Teacher.create({ ...parsed.data, mosqueId });
    }
    // 4. Cache Invalidation
    revalidatePath("/dashboard/teachers");
    if (id) revalidatePath(`/dashboard/teachers/${id}`);
    // 5. Unified Return
    return ok(
      undefined,
      id ? "تم تحديث بيانات المعلم بنجاح." : "تمت إضافة المعلم بنجاح.",
    );
  } catch (error) {
    // 6. Error Handling
    return handleActionError(error, "saveTeacher");
  }
}

export async function deleteTeacher(id: string): Promise<ActionResponse> {
  try {
    // 1. Auth & DB
    const mosqueId = await getMosqueId();
    await connectDB();

    // 2. Execution
    const deletedTeacher = await Teacher.findOneAndDelete({
      _id: id,
      mosqueId,
    });
    if (!deletedTeacher)
      return fail("المعلم غير موجود أو لا تملك صلاحية حذفه.");

    // 3. Cache Invalidation
    revalidatePath("/dashboard/teachers");
    // 4. Unified Return
    return ok(undefined, "تم حذف المعلم بنجاح.");
  } catch (error) {
    // 5. Error Handling
    return handleActionError(error, "deleteTeacher");
  }
}
