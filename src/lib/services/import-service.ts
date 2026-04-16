/**
 * Import Service
 * Responsible for the core logic of processing and saving imported students.
 */
import { validateRows, ImportInput } from "@/lib/import/validator";
import Student from "@/models/Student";
import { connectDB } from "@/lib/db/connect";

export async function processStudentImport(rawRows: ImportInput[], mosqueId: string) {
  // 1. Validate all rows
  const results = validateRows(rawRows);
  const validRows = results.filter((r) => r.status === "valid");
  const invalidRows = results.filter((r) => r.status === "invalid");

  // 2. If no valid rows, return early with results
  if (validRows.length === 0) {
    return { inserted: 0, failed: invalidRows.length, errors: invalidRows };
  }

  // 3. Connect and bulk insert
  await connectDB();
  const docs = validRows.map((r) => {
    if (r.status !== "valid") return null;
    return { ...r.data, mosqueId, isActive: true };
  }).filter(Boolean);

  // ordered: false ensures that if one document fails (e.g. duplicate key), others continue
  await Student.insertMany(docs, { ordered: false });

  return {
    inserted: validRows.length,
    failed: invalidRows.length,
    errors: invalidRows,
  };
}