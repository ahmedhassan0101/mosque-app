/* eslint-disable @typescript-eslint/no-unused-vars */
// src/actions/session.actions.ts
"use server";

import {
  ok,
  fail,
  handleActionError,
  firstZodIssue,
  type ActionResponse,
} from "@/lib/utils/action-response";
import { getSessionContext } from "@/lib/auth/get-context";
import { connectDB } from "@/lib/db/client";
import Group from "@/models/group.model";
import Session from "@/models/session.model";
import { sessionSchema, type SessionInput } from "@/schemas/session.schema";
import { revalidatePath } from "next/cache";

import type { ActivityType } from "@/constants";
// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalizes a date to midnight UTC.
 * Ensures consistent date comparison across timezones.
 */
function toStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function revalidateSessionCache(activity?: ActivityType, groupId?: string) {
  revalidatePath("/dashboard/sessions");
  if (activity) revalidatePath(`/dashboard/sessions/${activity}`);
  if (groupId) revalidatePath(`/dashboard/groups/${activity}/${groupId}`);
}

// ─── Actions ──────────────────────────────────────────────────────────────────

/**
 * Creates one Session document per selected group (Split on Save).
 *
 * KEY DESIGN — Per-group attendance filtering:
 * The form collects ALL students from ALL selected groups.
 * The user marks who attended from that combined list.
 * When saving, each group's session only stores the attended students
 * who actually BELONG to that group.
 *
 * Example:
 *   Group A students: [s1, s2, s3]
 *   Group B students: [s4, s5, s6]
 *   User marks attended: [s1, s3, s4, s6]
 *
 *   → Session for Group A: attendedStudentIds: [s1, s3]
 *   → Session for Group B: attendedStudentIds: [s4, s6]
 *
 * This prevents cross-group contamination of attendance records.
 */
export async function createSession(
  data: SessionInput,
): Promise<ActionResponse> {
  // 1. Validate
  const parsed = sessionSchema.safeParse(data);
  if (!parsed.success) return fail(firstZodIssue(parsed.error));

  try {
    // 2. Auth & Tenancy
    const { mosqueId, user } = await getSessionContext();
    await connectDB();

    const { groupIds, attendedStudentIds, ...sharedFields } = parsed.data;

    // 3. Fetch all selected groups to get their student rosters
    // We need this to filter attendance per group correctly
    const groups = await Group.find(
      { _id: { $in: groupIds }, mosqueId },
      { _id: 1, studentIds: 1 }, // project only what we need
    ).lean();

    if (groups.length === 0) {
      return fail("لم يتم العثور على المجموعات المحددة.");
    }

    // Build a Set of attended IDs for O(1) lookup during filtering
    const attendedSet = new Set(attendedStudentIds);

    // 4. Build one document per group, filtering attendance to each group's students
    const sessionDocs = groups.map((group) => {
      // Convert group's studentIds to strings for comparison with attendedSet
      const groupStudentIdStrings = group.studentIds.map((id) => id.toString());

      // Only include students who (a) belong to this group AND (b) attended
      const filteredAttendance = groupStudentIdStrings.filter((sid) =>
        attendedSet.has(sid),
      );

      return {
        ...sharedFields,
        mosqueId,
        groupId: group._id,
        date: toStartOfDay(parsed.data.date),
        recordedBy: user.id,
        attendedStudentIds: filteredAttendance,
      };
    });

    // 5. Bulk insert — simple, no duplicate handling needed
    await Session.insertMany(sessionDocs);

    // 6. Revalidate
    revalidateSessionCache(parsed.data.activity);

    // 7. Return
    const count = sessionDocs.length;
    return ok(
      undefined,
      count === 1 ? "تم تسجيل الجلسة بنجاح." : `تم تسجيل ${count} جلسات بنجاح.`,
    );
  } catch (error) {
    return handleActionError(error, "createSession");
  }
}

/**
 * Updates an existing session by ID.
 * Edit always targets one specific document — no splitting needed.
 *
 * groupId is immutable after creation (you can't move a session to another group).
 */
export async function updateSession(
  sessionId: string,
  data: SessionInput,
): Promise<ActionResponse> {
  if (!sessionId?.trim()) return fail("معرّف الجلسة غير صالح.");

  const parsed = sessionSchema.safeParse(data);
  if (!parsed.success) return fail(firstZodIssue(parsed.error));

  try {
    const { mosqueId } = await getSessionContext();
    await connectDB();

    // groupIds is not updatable — extract and discard
    const { groupIds: _, ...updateFields } = parsed.data;

    const updated = await Session.findOneAndUpdate(
      { _id: sessionId, mosqueId },
      {
        $set: {
          ...updateFields,
          date: toStartOfDay(parsed.data.date),
        },
      },
      { new: true, runValidators: true },
    );

    if (!updated) return fail("الجلسة غير موجودة أو لا تملك صلاحية تعديلها.");

    revalidateSessionCache(
      updated.activity as ActivityType,
      updated.groupId.toString(),
    );

    return ok(undefined, "تم تحديث بيانات الجلسة بنجاح.");
  } catch (error) {
    return handleActionError(error, "updateSession");
  }
}

/**
 * Deletes a session by ID, scoped to the current mosque.
 * Uses findOneAndDelete (not deleteOne) to get activity + groupId
 * for accurate cache revalidation.
 */
export async function deleteSession(
  sessionId: string,
): Promise<ActionResponse> {
  if (!sessionId?.trim()) return fail("معرّف الجلسة غير صالح.");

  try {
    const { mosqueId } = await getSessionContext();
    await connectDB();

    const deleted = await Session.findOneAndDelete({
      _id: sessionId,
      mosqueId,
    });

    if (!deleted) return fail("الجلسة غير موجودة أو لا تملك صلاحية حذفها.");

    revalidateSessionCache(
      deleted.activity as ActivityType,
      deleted.groupId.toString(),
    );

    return ok(undefined, "تم حذف الجلسة بنجاح.");
  } catch (error) {
    return handleActionError(error, "deleteSession");
  }
}

/**
 * Data-fetching Server Actions for the SessionForm.
 *
 * Why a Server Action instead of an API route?
 * - Consistent with our architecture (no Route Handlers for internal data)
 * - Automatically scoped to the current user's mosqueId
 * - Called from the Client Component when groupIds change
 */

import {
  AttendanceStudentOption,
  getStudentsOptionsByGroupIds,
} from "@/queries/student.queries";

/**
 * Fetches the attendance student list for the selected groups.
 * Called client-side when the user changes group selection in the form.
 */
export async function fetchStudentsForGroups(
  groupIds: string[],
): Promise<ActionResponse<AttendanceStudentOption[]>> {
  try {
    if (groupIds.length === 0) return ok([]);
    const students = await getStudentsOptionsByGroupIds(groupIds);
    return ok(students);
  } catch (error) {
    return handleActionError(error, "fetchStudentsForGroups");
  }
}
