// src\actions\teacher.actions.ts
"use server";

import {
  fail,
  firstZodIssue,
  handleActionError,
  ok,
  type ActionResponse,
} from "@/lib/utils/action-response";
import { getMosqueId } from "@/lib/auth/get-context";
import { connectDB } from "@/lib/db/client";
import Teacher from "@/models/teacher.model";
import { teacherSchema, type TeacherInput } from "@/schemas/teacher.schema";
import { revalidatePath } from "next/cache";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Invalidates all teacher-related cache paths after any mutation. */
function revalidateTeacherCache(id?: string) {
  revalidatePath("/dashboard/teachers");
  if (id) revalidatePath(`/dashboard/teachers/${id}`);
  if (id) revalidatePath(`/dashboard/teachers/${id}/edit`);
}

// ─── Actions ────────────────────────────────────────────────────────────────

/**
 * Creates a new teacher OR updates an existing one.
 * Single action handles both to DRY up the form component.
 *
 * Skeleton: Validate → Auth → DB → Revalidate → Return
 *
 * @param data - Validated form data matching TeacherInput.
 * @param id   - If provided, performs an update; otherwise creates.
 */

export async function saveTeacher(
  data: TeacherInput,
  id?: string,
): Promise<ActionResponse> {
  // 1. Validate — always first, before touching auth or DB
  const parsed = teacherSchema.safeParse(data);
  if (!parsed.success) return fail(firstZodIssue(parsed.error));

  try {
    // 2. Auth & Tenancy — get mosqueId AFTER validation to avoid unnecessary auth calls
    const mosqueId = await getMosqueId();
    await connectDB();

    // 3. Execution
    if (id) {
      // ── UPDATE ──
      // findOneAndUpdate with mosqueId in the filter = zero-trust tenancy.
      // If the id belongs to another mosque, `updated` will be null.
      const updated = await Teacher.findOneAndUpdate(
        { _id: id, mosqueId },
        // $set prevents accidentally nullifying fields not in the form.
        { $set: parsed.data },
        { new: true, runValidators: true },
      );
      if (!updated) return fail("المعلم غير موجود أو لا تملك صلاحية تعديله.");
    } else {
      // ── CREATE ──
      await Teacher.create({ ...parsed.data, mosqueId });
    }
    // 4. Cache Invalidation — after successful DB write
    revalidateTeacherCache(id);

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

/**
 * Deletes a teacher by ID, scoped to the current user's mosque.
 *
 * Skeleton: Auth → DB → Revalidate → Return
 *
 * NOTE: No Zod validation needed here — we only receive a string ID.
 * Basic existence check is done at the DB level (findOneAndDelete).
 *
 * @param id - The MongoDB ObjectId string of the teacher to delete.
 */

export async function deleteTeacher(id: string): Promise<ActionResponse> {
  // Guard: basic sanity check on the id format before hitting the DB
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return fail("معرّف المعلم غير صالح.");
  }
  try {
    // 1. Auth & Tenancy
    const mosqueId = await getMosqueId();
    await connectDB();

    // 2. Execution — mosqueId in filter = tenancy enforcement
    const deleted = await Teacher.findOneAndDelete({
      _id: id,
      mosqueId,
    });
    if (!deleted) return fail("المعلم غير موجود أو لا تملك صلاحية حذفه.");

    // 3. Cache Invalidation — invalidate both list and detail pages
    revalidateTeacherCache(id);

    // 4. Unified Return
    return ok(undefined, "تم حذف المعلم بنجاح.");
  } catch (error) {
    // 5. Error Handling
    return handleActionError(error, "deleteTeacher");
  }
}
