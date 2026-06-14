// src/lib/import/parser.ts
import ExcelJS from "exceljs";
import { COLUMN_HEADERS, REQUIRED_MARKER } from "@/constants";
import type { ImportRawRow } from "./validator";

const HEADER_MAP: Record<string, keyof ImportRawRow> = {
  [`${COLUMN_HEADERS.NAME}${REQUIRED_MARKER}`]: "name",
  [`${COLUMN_HEADERS.GENDER}${REQUIRED_MARKER}`]: "gender",
  [COLUMN_HEADERS.BIRTH_DATE]: "birthDate",
  [`${COLUMN_HEADERS.LEVEL}${REQUIRED_MARKER}`]: "level",
  [COLUMN_HEADERS.PHONE]: "phone",
  [`${COLUMN_HEADERS.GUARDIAN_RELATION}${REQUIRED_MARKER}`]: "guardianRelation",
  [`${COLUMN_HEADERS.GUARDIAN_PHONE}${REQUIRED_MARKER}`]: "guardianPhone",
  [COLUMN_HEADERS.ADDRESS]: "address",
  [COLUMN_HEADERS.CURRENT_SURAH]: "currentSurah",
  [COLUMN_HEADERS.CURRENT_AYAH]: "currentAyah",
  [COLUMN_HEADERS.NOTES]: "notes",
};

/**
 * Parses an uploaded Excel buffer into raw row objects using ExcelJS.
 * Async because ExcelJS reads workbooks as streams internally.
 */
export async function parseImportFile(buffer: Buffer): Promise<ImportRawRow[]> {
  const wb = new ExcelJS.Workbook();

  // ExcelJS expects ArrayBuffer, not Node.js Buffer
  // Convert via the underlying ArrayBuffer reference
  // await wb.xlsx.load(Buffer.from(buffer) as unknown as Buffer);
  // await wb.xlsx.load(new Uint8Array(buffer) as unknown as Buffer);
  await wb.xlsx.load(
    buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    ) as ArrayBuffer,
  );


  // Always use the first sheet (the data sheet)
  const ws = wb.worksheets[0];
  if (!ws) return [];

  // Extract headers from row 1
  const headerRow = ws.getRow(1);
  const headerMap = new Map<number, keyof ImportRawRow>();

  headerRow.eachCell((cell, colNumber) => {
    const header = String(cell.value ?? "").trim();
    const fieldKey = HEADER_MAP[header];
    if (fieldKey) headerMap.set(colNumber, fieldKey);
  });

  const results: ImportRawRow[] = [];

  // Start from row 3 — row 1 is headers, row 2 is sample data
  ws.eachRow((row, rowNumber) => {
    if (rowNumber <= 2) return;

    const mapped: Partial<ImportRawRow> = {};
    let hasAnyValue = false;

    headerMap.forEach((fieldKey, colNumber) => {
      const cell = row.getCell(colNumber);
      // ExcelJS returns cell.value which can be various types
      const raw = cell.value;
      const value = raw !== null && raw !== undefined ? String(raw).trim() : "";
      mapped[fieldKey] = value;
      if (value) hasAnyValue = true;
    });

    // Skip completely empty rows
    if (hasAnyValue) {
      results.push(mapped as ImportRawRow);
    }
  });

  return results;
}
// import * as XLSX from "xlsx";
// // Cannot find module 'xlsx' or its corresponding type declarations.
// import { COLUMN_HEADERS, REQUIRED_MARKER } from "@/constants";
// import type { ImportRawRow } from "./validator";

// /**
//  * Maps the Arabic Excel headers to our internal field keys.
//  * Built from COLUMN_HEADERS constants to stay in sync with the template.
//  */
// const HEADER_MAP: Record<string, keyof ImportRawRow> = {
//   [`${COLUMN_HEADERS.NAME}${REQUIRED_MARKER}`]: "name",
//   [`${COLUMN_HEADERS.GENDER}${REQUIRED_MARKER}`]: "gender",
//   [COLUMN_HEADERS.BIRTH_DATE]: "birthDate",
//   [`${COLUMN_HEADERS.LEVEL}${REQUIRED_MARKER}`]: "level",
//   [COLUMN_HEADERS.PHONE]: "phone",
//   [`${COLUMN_HEADERS.GUARDIAN_RELATION}${REQUIRED_MARKER}`]: "guardianRelation",
//   [`${COLUMN_HEADERS.GUARDIAN_PHONE}${REQUIRED_MARKER}`]: "guardianPhone",
//   [COLUMN_HEADERS.ADDRESS]: "address",
//   [COLUMN_HEADERS.CURRENT_SURAH]: "currentSurah",
//   [COLUMN_HEADERS.CURRENT_AYAH]: "currentAyah",
//   [COLUMN_HEADERS.NOTES]: "notes",
// };

// /**
//  * Parses an uploaded Excel or CSV buffer into raw row objects.
//  *
//  * Steps:
//  * 1. Read the workbook from buffer.
//  * 2. Take the first sheet (the data sheet, not the reference sheet).
//  * 3. Convert to JSON with Arabic headers as keys.
//  * 4. Map Arabic headers → field keys using HEADER_MAP.
//  * 5. Skip completely empty rows.
//  */
// export function parseImportFile(buffer: Buffer): ImportRawRow[] {
//   const wb = XLSX.read(buffer, { type: "buffer", cellDates: false });
//   const ws = wb.Sheets[wb.SheetNames[0]];

//   const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
//     defval: "",
//     raw: false, // format all values as strings (handles dates safely)
//   });

//   return raw
//     .filter((row) =>
//       // Parameter 'row' implicitly has an 'any' type.
//       // Skip rows where every cell is empty
//       Object.values(row).some((v) => String(v ?? "").trim() !== ""),
//     )
//     .map((row): ImportRawRow => {
//       // Parameter 'row' implicitly has an 'any' type.
//       const mapped: Partial<ImportRawRow> = {};

//       for (const [arabicHeader, fieldKey] of Object.entries(HEADER_MAP)) {
//         const value = row[arabicHeader];
//         mapped[fieldKey] = value !== undefined ? String(value).trim() : "";
//       }

//       return mapped as ImportRawRow;
//     });
// }
