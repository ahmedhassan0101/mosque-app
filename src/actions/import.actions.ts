// src/actions/import.actions.ts
"use server";

import {
  ok,
  fail,
  handleActionError,
  type ActionResponse,
} from "@/lib/utils/action-response";
import { getMosqueId } from "@/lib/auth/get-context";
import { connectDB } from "@/lib/db/client";
import { parseImportFile } from "@/lib/import/parser";
import { validateRows } from "@/lib/import/validator";
import { generateImportTemplate } from "@/lib/import/template";
import Student from "@/models/student.model";
import { IMPORT_LIMITS } from "@/constants";
import { revalidatePath } from "next/cache";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ImportRowError = {
  row: number;
  errors: string[];
};

export type ImportResult = {
  inserted: number;
  failed: number;
  errors: ImportRowError[];
};

// ─── Download Template Action ─────────────────────────────────────────────────

/**
 * Generates and returns the Excel template as a base64 string.
 *
 * Why base64? Server Actions cannot return raw Buffers to the client.
 * The client decodes it and triggers a browser download via Blob URL.
 */
export async function downloadTemplateAction(): Promise<
  ActionResponse<{ base64: string; filename: string }>
> {
  try {
    const buffer = await generateImportTemplate();
    return ok(
      {
        base64: buffer.toString("base64"),
        filename: "students-import-template.xlsx",
      },
      "تم إنشاء النموذج بنجاح.",
    );
  } catch (error) {
    return handleActionError(error, "downloadTemplateAction");
  }
}

/**
 * Processes an uploaded Excel file:
 * 1. Validates file type and size.
 * 2. Parses rows from the file.
 * 3. Validates each row with Zod.
 * 4. Bulk inserts valid rows into MongoDB.
 * 5. Returns a structured result with per-row error details.
 *
 * Skeleton: Validate File → Auth → Parse → Validate Rows → Insert → Revalidate → Return
 */
export async function importStudentsAction(
  formData: FormData,
): Promise<ActionResponse<ImportResult>> {
  try {
    // ── 1. Auth ────────────────────────────────────────────────────────────
    const mosqueId = await getMosqueId();

    // ── 2. File validation ─────────────────────────────────────────────────
    const file = formData.get("file") as File | null;

    if (!file) return fail("لم يتم إرسال أي ملف.");

    const isValidType =
      file.name.match(/\.(xlsx|xls|csv)$/i) ||
      [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ].includes(file.type);

    if (!isValidType) return fail("يُسمح فقط بملفات Excel أو CSV.");

    const maxBytes = IMPORT_LIMITS.MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes)
      return fail(
        `حجم الملف يجب أن يكون أقل من ${IMPORT_LIMITS.MAX_FILE_SIZE_MB}MB.`,
      );

    // ── 3. Parse ───────────────────────────────────────────────────────────
    const buffer = Buffer.from(await file.arrayBuffer());
    const rawRows = await parseImportFile(buffer);

    if (rawRows.length === 0)
      return fail("الملف فارغ أو لا يحتوي على بيانات صحيحة.");

    if (rawRows.length > IMPORT_LIMITS.MAX_ROWS)
      return fail(`الحد الأقصى ${IMPORT_LIMITS.MAX_ROWS} طالب في كل ملف.`);

    // ── 4. Validate rows ───────────────────────────────────────────────────
    const rowResults = validateRows(rawRows);
    const validRows = rowResults.filter((r) => r.status === "valid");
    const invalidRows = rowResults.filter((r) => r.status === "invalid");

    // If ALL rows fail — return early with structured errors
    if (validRows.length === 0) {
      return ok(
        {
          inserted: 0,
          failed: invalidRows.length,
          errors: invalidRows.map((r) => ({
            row: r.row,
            errors: r.status === "invalid" ? r.errors : [],
          })),
        },
        "لم يتم استيراد أي طالب — جميع الصفوف تحتوي على أخطاء.",
      );
    }

    // ── 5. Bulk insert ─────────────────────────────────────────────────────
    await connectDB();

    const docs = validRows
      .filter((r) => r.status === "valid")
      .map((r) => {
        if (r.status !== "valid") return null;

        const { guardianRelation, guardianPhone, ...rest } = r.data;

        return {
          ...rest,
          mosqueId,
          isActive: true,
          enrollments: [],
          // Assemble the guardians array from the flat columns
          guardians: [{ relation: guardianRelation, phone: guardianPhone }],
        };
      })
      .filter(Boolean);

    // ordered: false — continues inserting even if one document fails
    // (e.g., duplicate name within the same mosque)
    await Student.insertMany(docs, { ordered: false });

    // ── 6. Revalidate ──────────────────────────────────────────────────────
    revalidatePath("/dashboard/students");

    // ── 7. Return ──────────────────────────────────────────────────────────
    return ok(
      {
        inserted: validRows.length,
        failed: invalidRows.length,
        errors: invalidRows.map((r) => ({
          row: r.row,
          errors: r.status === "invalid" ? r.errors : [],
        })),
      },
      `تم استيراد ${validRows.length} طالب بنجاح.`,
    );
  } catch (error) {
    return handleActionError(error, "importStudentsAction");
  }
}
