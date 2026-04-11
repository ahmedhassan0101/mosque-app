/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getMosqueId } from "@/lib/auth/get-context";
import { connectDB } from "@/lib/db/connect";
import Student from "@/models/Student";
import { parseImportFile } from "@/lib/import/parser";
import { validateRows } from "@/lib/import/validator";
import { generateImportTemplate } from "@/lib/import/template";

/**
 * GET /api/students/import
 * Download the Excel template
 */
export async function GET() {
  try {
    const buffer = generateImportTemplate();
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="students-template.xlsx"',
      },
    });
  } catch {
    return NextResponse.json({ error: "تعذّر إنشاء النموذج" }, { status: 500 });
  }
}

/**
 * POST /api/students/import
 * Upload and import students from Excel/CSV
 *
 * Returns:
 * {
 *   inserted: number,
 *   failed:   number,
 *   errors:   { row, errors }[]
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const mosqueId = await getMosqueId();

    // ── 1. Parse multipart form ──────────────────────────────────────
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "لم يتم إرسال أي ملف" },
        { status: 400 },
      );
    }

    const allowed = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];
    if (
      !allowed.includes(file.type) &&
      !file.name.match(/\.(xlsx|xls|csv)$/i)
    ) {
      return NextResponse.json(
        { error: "يُسمح فقط بملفات Excel أو CSV" },
        { status: 400 },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "حجم الملف يجب أن يكون أقل من 5MB" },
        { status: 400 },
      );
    }

    // ── 2. Parse file ────────────────────────────────────────────────
    const buffer = Buffer.from(await file.arrayBuffer());
    const rawRows = parseImportFile(buffer);

    if (rawRows.length === 0) {
      return NextResponse.json(
        { error: "الملف فارغ أو لا يحتوي على بيانات صحيحة" },
        { status: 400 },
      );
    }

    if (rawRows.length > 500) {
      return NextResponse.json(
        { error: "الحد الأقصى 500 طالب في كل ملف" },
        { status: 400 },
      );
    }

    // ── 3. Validate all rows ─────────────────────────────────────────
    const results = validateRows(rawRows);
    const valid = results.filter((r) => r.status === "valid");
    const invalid = results.filter((r) => r.status === "invalid");

    // If ALL rows fail — return immediately
    if (valid.length === 0) {
      return NextResponse.json(
        {
          inserted: 0,
          failed: invalid.length,
          errors: invalid.map((r) => ({
            row: r.row,
            errors: r.status === "invalid" ? r.errors : [],
          })),
        },
        { status: 422 },
      );
    }

    // ── 4. Bulk insert valid rows ────────────────────────────────────
    await connectDB();

    const docs = valid
      .map((r) => {
        if (r.status !== "valid") return null;
        return { ...r.data, mosqueId, isActive: true };
      })
      .filter(Boolean);

    // insertMany with ordered:false — continues even if some fail
    await Student.insertMany(docs, { ordered: false });

    // ── 5. Return structured result ──────────────────────────────────
    return NextResponse.json({
      inserted: valid.length,
      failed: invalid.length,
      errors: invalid.map((r) => ({
        row: r.row,
        errors: r.status === "invalid" ? r.errors : [],
      })),
    });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    console.error("[POST /api/students/import]", e);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
