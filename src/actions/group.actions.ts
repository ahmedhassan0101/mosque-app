/* eslint-disable @typescript-eslint/no-unused-vars */
// src\actions\group.actions.ts
"use server";

import { ActivityType } from "@/constants";
import {
  fail,
  firstZodIssue,
  handleActionError,
  ok,
  type ActionResponse,
} from "@/lib/utils/action-response";
import { getMosqueId } from "@/lib/auth/get-context";
import { connectDB } from "@/lib/db/client";
import Group from "@/models/group.model";
import Student from "@/models/student.model";
import { groupSchema, type GroupInput } from "@/schemas/group.schema";
import { revalidatePath } from "next/cache";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Invalidates all group-related cache paths after any mutation. */
function revalidateGroupCache(type?: string, id?: string) {
  revalidatePath("/dashboard/groups");
  if (type) revalidatePath(`/dashboard/groups/${type}`);
  if (type && id) revalidatePath(`/dashboard/groups/${type}/${id}`);
  if (type && id) revalidatePath(`/dashboard/groups/${type}/${id}/edit`);
}

/**
 * Syncs student enrollments after a group mutation.
 *
 * For ADDED students: simply push the activity into their enrollments.
 *
 * For REMOVED students: we CANNOT blindly pull the activity.
 * A student might be enrolled in TWO groups of the same activity
 * (e.g., two quran groups). Removing the activity would incorrectly
 * strip it even though they're still active in the other group.
 *
 * Solution: Query all OTHER groups that share the same activity and
 * find which removed students are still members of at least one.
 * Only students with zero remaining memberships get the activity pulled.
 *
 * @param activity        - The group's activity type (e.g. "quran")
 * @param addedIds        - Student IDs newly added to this group
 * @param removedIds      - Student IDs removed from this group
 * @param currentGroupId  - The group being mutated (excluded from the "other groups" query)
 */
async function syncStudentEnrollments(
  activity: ActivityType,
  addedIds: string[],
  removedIds: string[],
  currentGroupId?: string,
): Promise<void> {
  const ops: Promise<unknown>[] = [];

  // ── ADD: straightforward — push activity if not already present ──
  if (addedIds.length > 0) {
    ops.push(
      Student.updateMany(
        { _id: { $in: addedIds } },
        { $addToSet: { enrollments: activity } },
      ),
    );
  }

  // ── REMOVE: only pull if the student has no OTHER group with same activity ──
  if (removedIds.length > 0) {
    /**
     * Find all OTHER groups with the same activity that still contain
     * at least one of the removed students.
     *
     * Query: groups where:
     *   - activity matches
     *   - _id is NOT the current group (we already removed them from it)
     *   - studentIds overlaps with our removedIds list
     */
    const otherGroupsWithSameActivity = await Group.find(
      {
        activity,
        ...(currentGroupId ? { _id: { $ne: currentGroupId } } : {}),
        studentIds: { $in: removedIds },
      },
      { studentIds: 1 }, // project only what we need
    ).lean();

    // Build a Set of students who are still in at least one other group
    const stillEnrolledElsewhere = new Set<string>(
      otherGroupsWithSameActivity.flatMap((g) =>
        g.studentIds.map((sid) => sid.toString()),
      ),
    );

    // Only pull the activity from students with NO remaining membership
    const safeToRemove = removedIds.filter(
      (sid) => !stillEnrolledElsewhere.has(sid),
    );

    if (safeToRemove.length > 0) {
      ops.push(
        Student.updateMany(
          { _id: { $in: safeToRemove } },
          { $pull: { enrollments: activity } },
        ),
      );
    }
  }

  await Promise.all(ops);
}

// ─── Actions ────────────────────────────────────────────────────────────────

/**
 * Creates a new group OR updates an existing one.
 *
 * Skeleton: Validate → Auth → DB → Sync Enrollments → Revalidate → Return
 *
 * Security note: `activity` is stripped from update payloads to prevent
 * clients from changing a group's type after creation via form manipulation.
 */
export async function saveGroup(
  data: GroupInput,
  id?: string,
): Promise<ActionResponse> {
  // 1. Validate
  const parsed = groupSchema.safeParse(data);
  if (!parsed.success) return fail(firstZodIssue(parsed.error));

  try {
    // 2. Auth & Tenancy
    const mosqueId = await getMosqueId();
    await connectDB();

    const newStudentIds = parsed.data.studentIds ?? [];

    if (id) {
      // ── UPDATE ──
      const existing = await Group.findOne({ _id: id, mosqueId }).lean();
      if (!existing)
        return fail("المجموعة غير موجودة أو لا تملك الصلاحية لتعديلها.");

      // Strip activity — group type is immutable after creation
      const { activity: _activity, ...updateData } = parsed.data;

      const existingStudentIds = existing.studentIds.map((sid) =>
        sid.toString(),
      );

      // Diff: who was added vs who was removed
      const addedIds = newStudentIds.filter(
        (sid) => !existingStudentIds.includes(sid),
      );
      const removedIds = existingStudentIds.filter(
        (sid) => !newStudentIds.includes(sid),
      );

      await Group.findOneAndUpdate(
        { _id: id, mosqueId },
        { $set: updateData },
        { new: true, runValidators: true },
      );

      // 3. Sync student enrollments
      // Pass currentGroupId so the query excludes this group correctly
      await syncStudentEnrollments(existing.activity, addedIds, removedIds, id);
    } else {
      // ── CREATE ──
      await Group.create({ ...parsed.data, mosqueId });

      // All students in the new group get this activity added
      await syncStudentEnrollments(parsed.data.activity, newStudentIds, []);
    }

    // 4. Cache Invalidation
    revalidateGroupCache(parsed.data.activity, id);
    // Also revalidate students list since enrollments changed
    revalidatePath("/dashboard/students");

    // 5. Unified Return
    return ok(
      undefined,
      id ? "تم تحديث بيانات المجموعة بنجاح." : "تم إنشاء المجموعة بنجاح.",
    );
  } catch (error) {
    return handleActionError(error, "saveGroup");
  }
}

/**
 * Deletes a group and removes its activity from all enrolled students.
 *
 * @param id   - The MongoDB ObjectId string of the group.
 * @param type - The activity type, used for cache invalidation.
 */
export async function deleteGroup(
  id: string,
  type: ActivityType,
): Promise<ActionResponse> {
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return fail("معرّف المجموعة غير صالح.");
  }

  try {
    // 1. Auth & Tenancy
    const mosqueId = await getMosqueId();
    await connectDB();

    // 2. Fetch before delete to get studentIds for enrollment cleanup
    const group = await Group.findOneAndDelete({ _id: id, mosqueId });
    if (!group) return fail("المجموعة غير موجودة أو لا تملك الصلاحية لحذفها.");

    // 3. Remove this activity from all previously enrolled students
    const enrolledIds = group.studentIds.map((sid) => sid.toString());

    // Pass the deleted group's id so the sync query knows to exclude it
    // (it's already deleted from DB, but passing it is harmless and explicit)
    await syncStudentEnrollments(group.activity, [], enrolledIds, id);

    // 4. Cache Invalidation
    revalidateGroupCache(type, id);
    revalidatePath("/dashboard/students");

    // 5. Unified Return
    return ok(undefined, "تم حذف المجموعة بنجاح.");
  } catch (error) {
    return handleActionError(error, "deleteGroup");
  }
}
