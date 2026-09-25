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
import MonthlyReport from "@/models/monthlyReport.model";
import Student from "@/models/student.model";
import {
  monthlyReportSchema,
  type MonthlyReportInput,
} from "@/schemas/monthlyReport.schema";
import { revalidatePath } from "next/cache";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Invalidates student & report cache paths after any mutation. */
function revalidateReportCache(studentId: string) {
  revalidatePath("/dashboard/students");
  revalidatePath(`/dashboard/students/${studentId}`);
  revalidatePath(`/dashboard/students/${studentId}/reports`);
}

/**
 * Strips keys with `undefined` values from an object.
 */
function omitUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}

// ─── Actions ────────────────────────────────────────────────────────────────

/**
 * Creates a new monthly report OR updates an existing one.
 * Atomically updates the student's currentSurah and currentAyah markers.
 *
 * Skeleton: Validate → Auth & Tenancy → DB Operations → Cache Revalidation → Return
 *
 * @param studentId - The ID of the student receiving the report.
 * @param data      - Validated form data matching MonthlyReportInput.
 * @param id        - If provided, performs an update; otherwise creates.
 */
export async function saveMonthlyReport(
  studentId: string,
  data: MonthlyReportInput,
  id?: string,
): Promise<ActionResponse> {
  if (!studentId || typeof studentId !== "string" || studentId.trim().length === 0) {
    return fail("معرّف الطالب غير صالح.");
  }

  // 1. Validation (Zod)
  const parsed = monthlyReportSchema.safeParse(data);
  if (!parsed.success) return fail(firstZodIssue(parsed.error));

  try {
    // 2. Auth & Tenancy
    const mosqueId = await getMosqueId();
    await connectDB();

    // Verify student exists and belongs to the current mosque tenancy
    const student = await Student.findOne({ _id: studentId, mosqueId });
    if (!student) {
      return fail("الطالب غير موجود أو لا تملك صلاحية الوصول إليه.");
    }

    // 3. Execution
    if (id) {
      // ── UPDATE ──
      const updatePayload = omitUndefined(
        parsed.data as Record<string, unknown>,
      );

      const updated = await MonthlyReport.findOneAndUpdate(
        { _id: id, studentId, mosqueId },
        { $set: updatePayload },
        { new: true, runValidators: true },
      );

      if (!updated) {
        return fail("التقرير الشهري غير موجود أو لا تملك صلاحية تعديله.");
      }
    } else {
      // ── CREATE ──
      await MonthlyReport.create({
        ...parsed.data,
        studentId,
        mosqueId,
      });
    }

    // Atomically update student's latest memorization markers (surahTo & ayahTo)
    await Student.updateOne(
      { _id: studentId, mosqueId },
      {
        $set: {
          currentSurah: parsed.data.surahTo,
          currentAyah: parsed.data.ayahTo,
        },
      },
    );

    // 4. Cache Invalidation
    revalidateReportCache(studentId);

    return ok(
      undefined,
      id ? "تم تحديث التقرير الشهري بنجاح." : "تم إضافة التقرير الشهري بنجاح.",
    );
  } catch (error: unknown) {
    // Handle MongoDB duplicate key error for compound index (studentId + month)
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return fail("تم إضافة تقرير شهري لهذا الطالب عن هذا الشهر من قبل.");
    }

    return handleActionError(error, "saveMonthlyReport");
  }
}

/**
 * Deletes a monthly report and invalidates relevant student pages.
 *
 * @param id - The ID of the monthly report to delete.
 */
export async function deleteMonthlyReport(id: string): Promise<ActionResponse> {
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return fail("معرّف التقرير غير صالح.");
  }

  try {
    // 1. Auth & Tenancy
    const mosqueId = await getMosqueId();
    await connectDB();

    // 2. Execution — tenancy enforced via mosqueId
    const deleted = await MonthlyReport.findOneAndDelete({
      _id: id,
      mosqueId,
    });

    if (!deleted) {
      return fail("التقرير الشهري غير موجود أو لا تملك الصلاحية لحذفه.");
    }

    // 3. Cache Invalidation
    revalidateReportCache(deleted.studentId.toString());

    // 4. Return
    return ok(undefined, "تم حذف التقرير الشهري بنجاح.");
  } catch (error) {
    return handleActionError(error, "deleteMonthlyReport");
  }
}