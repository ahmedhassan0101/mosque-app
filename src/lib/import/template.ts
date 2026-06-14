// src/lib/import/template.ts
import ExcelJS from "exceljs";
import { GENDERS, LEVELS, COLUMN_HEADERS, REQUIRED_MARKER } from "@/constants";

/**
 * Column definitions for the import template.
 * Each entry maps to one Excel column.
 */
const COLUMNS: {
  header: string;
  key: string;
  width: number;
  required: boolean;
  dropdown?: readonly string[];
  note?: string;
}[] = [
  {
    header: COLUMN_HEADERS.NAME,
    key: "name",
    width: 25,
    required: true,
    note: "الاسم الكامل للطالب",
  },
  {
    header: COLUMN_HEADERS.GENDER,
    key: "gender",
    width: 18,
    required: true,
    dropdown: GENDERS.values,
    note: "اختر من القائمة",
  },
  {
    header: COLUMN_HEADERS.BIRTH_DATE,
    key: "birthDate",
    width: 22,
    required: false,
    note: "صيغة: YYYY-MM-DD مثال: 2012-05-15",
  },
  {
    header: COLUMN_HEADERS.LEVEL,
    key: "level",
    width: 22,
    required: true,
    dropdown: LEVELS.values,
    note: "اختر من القائمة",
  },
  {
    header: COLUMN_HEADERS.PHONE,
    key: "phone",
    width: 20,
    required: false,
    note: "هاتف الطالب الشخصي إن وجد",
  },
  {
    header: COLUMN_HEADERS.GUARDIAN_RELATION,
    key: "guardianRelation",
    width: 25,
    required: true,
    note: "مثال: أب، أم، أخ، جد",
  },
  {
    header: COLUMN_HEADERS.GUARDIAN_PHONE,
    key: "guardianPhone",
    width: 22,
    required: true,
    note: "رقم هاتف ولي الأمر",
  },
  {
    header: COLUMN_HEADERS.ADDRESS,
    key: "address",
    width: 28,
    required: false,
    note: "الحي أو الشارع",
  },
  {
    header: COLUMN_HEADERS.CURRENT_SURAH,
    key: "currentSurah",
    width: 22,
    required: false,
    note: "السورة التي يحفظها حالياً",
  },
  {
    header: COLUMN_HEADERS.CURRENT_AYAH,
    key: "currentAyah",
    width: 16,
    required: false,
    note: "رقم الآية (أرقام فقط)",
  },
  {
    header: COLUMN_HEADERS.NOTES,
    key: "notes",
    width: 30,
    required: false,
    note: "أي ملاحظات إضافية",
  },
];

// Sample row matching the column order
const SAMPLE_VALUES: Record<string, string> = {
  name: "أحمد محمد علي",
  gender: "male",
  birthDate: "2012-05-15",
  level: "beginner",
  phone: "01012345678",
  guardianRelation: "أب",
  guardianPhone: "01098765432",
  address: "القاهرة - المعادي",
  currentSurah: "الفاتحة",
  currentAyah: "7",
  notes: "",
};

/**
 * Generates an ExcelJS workbook buffer for the student import template.
 *
 * Features:
 * - Dropdown validation for gender and level columns (no free typing)
 * - Required columns marked with * in the header
 * - Color-coded headers (required = green, optional = blue-grey)
 * - Sample data row showing expected format
 * - Second sheet with reference guide
 * - Locked header row (freeze pane)
 */
export async function generateImportTemplate(): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Masjid ERP";
  wb.created = new Date();

  // ── Sheet 1: Data entry ──────────────────────────────────────────────────
  const ws = wb.addWorksheet("الطلاب", {
    views: [{ rightToLeft: true, state: "frozen", ySplit: 1 }],
  });

  // Define columns
  ws.columns = COLUMNS.map((col) => ({
    header: col.required ? `${col.header}${REQUIRED_MARKER}` : col.header,
    key: col.key,
    width: col.width,
  }));

  // Style the header row
  const headerRow = ws.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell((cell, colNumber) => {
    const colDef = COLUMNS[colNumber - 1];
    const isRequired = colDef?.required ?? false;

    cell.font = { bold: true, size: 11, color: { argb: "FFFFFFFF" } };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      // Required = dark green, Optional = steel blue
      fgColor: { argb: isRequired ? "FF2D6A4F" : "FF4A6FA5" },
    };
    cell.border = {
      bottom: { style: "medium", color: { argb: "FFFFFFFF" } },
    };
  });

  // Add sample data row
  const sampleRow = ws.addRow(
    COLUMNS.map((col) => SAMPLE_VALUES[col.key] ?? ""),
  );
  sampleRow.height = 22;
  sampleRow.eachCell((cell) => {
    cell.font = { italic: true, color: { argb: "FF666666" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF5F5F5" },
    };
  });

  // Add dropdown data validation for enum columns
  // ExcelJS data validation prevents users from typing invalid values
  COLUMNS.forEach((colDef, colIndex) => {
    if (!colDef.dropdown) return;

    /**
     * ExcelJS data validation is set per-cell, not per-worksheet range.
     * We apply it to rows 3–1000 (row 1 = header, row 2 = sample).
     */
    for (let rowNum = 3; rowNum <= 200; rowNum++) {
      const cell = ws.getCell(rowNum, colIndex + 1);
      cell.dataValidation = {
        type: "list",
        allowBlank: false,
        formulae: [`"${colDef.dropdown.join(",")}"`],
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "قيمة غير مسموحة",
        error: `يُسمح فقط بـ: ${colDef.dropdown.join("، ")}`,
        showInputMessage: true,
        promptTitle: colDef.header,
        prompt: colDef.note ?? "اختر من القائمة المنسدلة",
      };
    }
  });
  // COLUMNS.forEach((colDef, colIndex) => {
  //   if (!colDef.dropdown) return;

  //   const colLetter = ws.getColumn(colIndex + 1).letter;

  //   ws.dataValidations.add(`${colLetter}3:${colLetter}1000`, {
  //     // Property 'dataValidations' does not exist on type 'Worksheet'.
  //     type: "list",
  //     allowBlank: false,
  //     // ExcelJS requires the list as a quoted comma-separated string
  //     formulae: [`"${colDef.dropdown.join(",")}"`],
  //     showErrorMessage: true,
  //     errorStyle: "stop",
  //     errorTitle: "قيمة غير مسموحة",
  //     error: `يُسمح فقط بـ: ${colDef.dropdown.join("، ")}`,
  //     showInputMessage: true,
  //     promptTitle: colDef.header,
  //     prompt: colDef.note ?? "اختر من القائمة المنسدلة",
  //   });
  // });

  // ── Sheet 2: Reference guide ──────────────────────────────────────────────
  const refWs = wb.addWorksheet("دليل الحقول", {
    views: [{ rightToLeft: true }],
  });

  refWs.columns = [
    { header: "الحقل", key: "field", width: 28 },
    { header: "إلزامي؟", key: "required", width: 12 },
    { header: "القيم المسموحة / التنسيق", key: "values", width: 45 },
    { header: "ملاحظة", key: "note", width: 40 },
  ];

  // Style reference header
  const refHeader = refWs.getRow(1);
  refHeader.height = 24;
  refHeader.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF374151" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // Reference data rows
  const refData = [
    {
      field: COLUMN_HEADERS.NAME,
      required: "نعم ✓",
      values: "نص حر",
      note: "الاسم الكامل",
    },
    {
      field: COLUMN_HEADERS.GENDER,
      required: "نعم ✓",
      values: GENDERS.values.join(" | "),
      note: "اختر من القائمة",
    },
    {
      field: COLUMN_HEADERS.BIRTH_DATE,
      required: "لا",
      values: "YYYY-MM-DD",
      note: "مثال: 2012-05-15",
    },
    {
      field: COLUMN_HEADERS.LEVEL,
      required: "نعم ✓",
      values: LEVELS.values.join(" | "),
      note: "اختر من القائمة",
    },
    {
      field: COLUMN_HEADERS.PHONE,
      required: "لا",
      values: "أرقام فقط",
      note: "هاتف الطالب الشخصي",
    },
    {
      field: COLUMN_HEADERS.GUARDIAN_RELATION,
      required: "نعم ✓",
      values: "أب، أم، أخ...",
      note: "نص حر",
    },
    {
      field: COLUMN_HEADERS.GUARDIAN_PHONE,
      required: "نعم ✓",
      values: "أرقام فقط، 10+ خانات",
      note: "هاتف ولي الأمر الأول",
    },
    {
      field: COLUMN_HEADERS.ADDRESS,
      required: "لا",
      values: "نص حر",
      note: "الحي أو الشارع",
    },
    {
      field: COLUMN_HEADERS.CURRENT_SURAH,
      required: "لا",
      values: "نص حر",
      note: "اسم السورة",
    },
    {
      field: COLUMN_HEADERS.CURRENT_AYAH,
      required: "لا",
      values: "رقم موجب",
      note: "رقم الآية",
    },
    {
      field: COLUMN_HEADERS.NOTES,
      required: "لا",
      values: "نص حر",
      note: "ملاحظات إضافية",
    },
  ];

  refData.forEach((row, i) => {
    const r = refWs.addRow(row);
    r.height = 20;
    r.eachCell((cell) => {
      cell.alignment = { vertical: "middle", wrapText: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: i % 2 === 0 ? "FFFAFAFA" : "FFFFFFFF" },
      };
    });
  });

  // Return as Node.js Buffer
  const arrayBuffer = await wb.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}
