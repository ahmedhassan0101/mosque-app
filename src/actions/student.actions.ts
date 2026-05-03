// src/actions/student.actions.ts
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
import Group from "@/models/group.model";
import Student from "@/models/student.model";
import { studentSchema, type StudentInput } from "@/schemas/student.schema";
import { revalidatePath } from "next/cache";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Invalidates all student-related cache paths after any mutation. */
function revalidateStudentCache(id?: string) {
  revalidatePath("/dashboard/students");
  if (id) revalidatePath(`/dashboard/students/${id}`);
  if (id) revalidatePath(`/dashboard/students/${id}/edit`);
}

/**
 * Strips keys with `undefined` values from an object.
 *
 * Why: When updating, `$set: parsed.data` would send `currentSurah: undefined`
 * to MongoDB, which silently unsets the field — destroying existing data.
 * We only send keys that were explicitly provided in the form submission.
 */
function omitUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}

// ─── Actions ────────────────────────────────────────────────────────────────

/**
 * Creates a new student OR updates an existing one.
 *
 * Skeleton: Validate → Auth → DB → Revalidate → Return
 *
 * @param data - Validated form data matching StudentInput.
 * @param id   - If provided, performs an update; otherwise creates.
 */

export async function saveStudent(
  data: StudentInput,
  id?: string,
): Promise<ActionResponse> {
  // 1. Validation (Zod)
  const parsed = studentSchema.safeParse(data);
  if (!parsed.success) return fail(firstZodIssue(parsed.error));

  try {
    // 2. Auth & Tenancy
    const mosqueId = await getMosqueId();
    await connectDB();

    // 3. Execution
    if (id) {
      // ── UPDATE ──
      // omitUndefined ensures we never accidentally $set a field to undefined,
      // which would silently delete existing data (e.g., currentSurah cleared).

      const updatePayload = omitUndefined(
        parsed.data as Record<string, unknown>,
      );

      const updated = await Student.findOneAndUpdate(
        { _id: id, mosqueId },
        { $set: updatePayload },
        { new: true, runValidators: true },
      );
      if (!updated) return fail("الطالب غير موجود أو لا تملك صلاحية تعديله.");
    } else {
      // ── CREATE ──
      await Student.create({ ...parsed.data, mosqueId });
    }

    // 4. Cache Invalidation
    revalidateStudentCache(id);

    return ok(
      undefined,
      id ? "تم تحديث بيانات الطالب بنجاح." : "تم تسجيل الطالب بنجاح.",
    );
  } catch (error) {
    return handleActionError(error, "saveStudent");
  }
}

/**
 * Deletes a student and cleans up all Group references.
 *
 * Cleanup steps after deletion:
 * 1. $pull the student ID from every Group's studentIds array.
 * 2. Revalidate affected group pages so stale data doesn't linger.
 *
 * We do NOT need to touch enrollments — the student document is gone.
 */
export async function deleteStudent(id: string): Promise<ActionResponse> {
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return fail("معرّف الطالب غير صالح.");
  }

  try {
    // 1. Auth & Tenancy
    const mosqueId = await getMosqueId();
    await connectDB();

    // 2. Execution — mosqueId in filter = tenancy enforcement
    // Find before delete — we need the group memberships for cleanup
    const deleted = await Student.findOneAndDelete({ _id: id, mosqueId });
    if (!deleted) return fail("الطالب غير موجود أو لا تملك الصلاحية لحذفه.");

    // 2. Remove this student's ID from ALL groups they were part of
    // We don't need the result — fire and move on
    await Group.updateMany(
      { studentIds: id, mosqueId },
      { $pull: { studentIds: id } },
    );

    // 3. Cache Invalidation
    // Revalidate student pages + groups list (student count changed)
    revalidateStudentCache(id);
    revalidatePath("/dashboard/groups");

    // 4. Unified Return
    return ok(undefined, "تم حذف سجل الطالب بنجاح.");
  } catch (error) {
    return handleActionError(error, "deleteStudent");
  }
}
