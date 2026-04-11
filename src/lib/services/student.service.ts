/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/lib/services/student.service.ts
// import { cache } from "react";
// import { connectDB } from "@/lib/db/connect";
// import Student from "@/models/Student";
// import { getMosqueId } from "@/lib/auth/get-context";

// export const getStudents = async (query: {
//   search?: string;
//   activity?: string;
//   page?: number;
//   limit?: number;
// }) => {
//   const mosqueId = await getMosqueId();
//   await connectDB();

//   const { search, activity, page = 1, limit = 20 } = query;
//   const skip = (page - 1) * limit;

//   const filter: any = { mosqueId, isActive: true };
//   if (activity) filter.enrollments = activity;
//   if (search) filter.name = { $regex: search, $options: "i" };

//   const [students, total] = await Promise.all([
//     Student.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
//     Student.countDocuments(filter),
//   ]);

//   return {
//     students: JSON.parse(JSON.stringify(students)), // Serialization آمنة
//     total,
//     totalPages: Math.ceil(total / limit),
//   };
// };

// export const getStudentById = cache(async (id: string) => {
//   const mosqueId = await getMosqueId();
//   await connectDB();
//   const student = await Student.findOne({ _id: id, mosqueId }).lean();
//   return student ? JSON.parse(JSON.stringify(student)) : null;
// });

 // src/lib/services/student.service.ts
import { cache } from "react";
import { connectDB } from "@/lib/db/connect";
import Student from "@/models/Student";
import { getMosqueId } from "@/lib/auth/get-context";
import type { StudentSerialized, StudentsListResult } from "@/types/serialized";

// ─── Serialize helper ─────────────────────────────────────────
/**
 * Converts a raw Mongoose Student document to a plain serialized object.
 * Replaces JSON.parse(JSON.stringify()) — explicit and type-safe.
 */
function serializeStudent(s: any): StudentSerialized {
  return {
    _id: s._id.toString(),
    mosqueId: s.mosqueId.toString(),
    name: s.name,
    birthDate: s.birthDate ? new Date(s.birthDate).toISOString() : "",
    gender: s.gender,
    phone: s.phone ?? undefined,
    guardianName: s.guardianName ?? undefined,
    guardianPhone: s.guardianPhone,
    guardianPhone2: s.guardianPhone2 ?? undefined,
    address: s.address ?? undefined,
    photo: s.photo ?? undefined,
    level: s.level,
    groupId: s.groupId ? s.groupId.toString() : undefined,
    enrollments: s.enrollments ?? [],
    trackIbadah: s.trackIbadah ?? false,
    currentSurah: s.currentSurah ?? undefined,
    currentAyah: s.currentAyah ?? undefined,
    notes: s.notes ?? undefined,
    isActive: s.isActive ?? true,
    createdAt:
      s.createdAt instanceof Date
        ? s.createdAt.toISOString()
        : String(s.createdAt),
  };
}

// ─── Queries ──────────────────────────────────────────────────

/**
 * getStudents
 * Paginated list with optional search and activity filter.
 * Used in: /students list page (server component + searchParams)
 */
export async function getStudents(query: {
  search?: string;
  activity?: string;
  page?: number;
  limit?: number;
}): Promise<StudentsListResult> {
  const mosqueId = await getMosqueId();
  await connectDB();

  const { search, activity, page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  // Typed filter — no any
  const filter: Record<string, unknown> = { mosqueId, isActive: true };
  if (activity) filter.enrollments = activity;
  if (search) filter.name = { $regex: search, $options: "i" };

  const [students, total] = await Promise.all([
    Student.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    Student.countDocuments(filter),
  ]);

  return {
    students: students.map(serializeStudent),
    total,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * getStudentById
 * Fetches a single student.
 * Wrapped in React cache() — same deduplication benefit as getSheikhById.
 * Used in: generateMetadata, /students/[id], /students/[id]/edit
 */
export const getStudentById = cache(
  async (id: string): Promise<StudentSerialized | null> => {
    const mosqueId = await getMosqueId();
    await connectDB();

    const s = await Student.findOne({ _id: id, mosqueId }).lean();
    if (!s) return null;
    return serializeStudent(s);
  },
);
