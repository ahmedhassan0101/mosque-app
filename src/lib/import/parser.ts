/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from "xlsx";
import type { ImportInput } from "./validator";

// Map from Arabic header → field key
 
const HEADER_MAP: Record<string, keyof ImportInput> = {
  "الاسم *": "name",
  "الجنس * (male/female)": "gender",
  "تاريخ الميلاد (YYYY-MM-DD)": "birthDate",
  "المستوى * (beginner/intermediate/advanced)": "level",
  "تليفون الطالب": "phone",
  "اسم ولي الأمر": "guardianName",
  "تليفون ولي الأمر *": "guardianPhone",
  "تليفون ولي الأمر 2": "guardianPhone2",
  العنوان: "address",
  "الأنشطة * (quran,tarbiya,tajweed,maqraa,playground)": "enrollments",
  "متابعة العبادات (true/false)": "trackIbadah",
  "السورة الحالية": "currentSurah",
  "رقم الآية": "currentAyah",
  ملاحظات: "notes",
};

/**
 * Parses an uploaded Excel or CSV file into raw row objects.
 * Maps Arabic headers to field keys using HEADER_MAP.
 * Skips empty rows automatically.
 */
export function parseImportFile(buffer: Buffer): ImportInput[] {
  const wb = XLSX.read(buffer, { type: "buffer", cellDates: true });

  // Always use the first sheet
  const ws = wb.Sheets[wb.SheetNames[0]];
  // XLSX.utils.sheet_to_json: Converts a worksheet object to an array of JS objects
  // where keys are taken from the first row (headers).
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
    defval: "", // empty cells → empty string
    raw: false, // format dates as strings
  });

  return raw
    .filter((row) =>
      // Skip completely empty rows
      Object.values(row).some((v) => String(v).trim() !== ""),
    )
    .map((row) => {
      const mapped: Partial<ImportInput> = {};
      for (const [arabicHeader, fieldKey] of Object.entries(HEADER_MAP)) {
        const value = row[arabicHeader];
        (mapped as any)[fieldKey] =
          value !== undefined ? String(value).trim() : "";
      }
      return mapped as ImportInput;
    });
}
