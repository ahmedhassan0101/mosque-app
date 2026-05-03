// src/lib/data/student.data.ts
import { cache } from "react";
import { getMosqueId } from "@/lib/auth/get-context";
import { connectDB } from "@/lib/db/db";
import Student from "@/models/student.model";
import { serialize, serializeMany } from "@/lib/db/serialize";
import type { StudentSerialized } from "@/types/serialized";
import { ActivityType } from "@/types";
import Group from "@/models/group.model";

// Re-export for convenience
export type { StudentSerialized };

// ─── Derived Types ───────────────────────────────────────────────────────────

/**
 * A group summary as shown on the student's profile page.
 * teacherName is a flat string — we don't need the full teacher object here.
 */
export type StudentGroupSummary = {
  _id: string;
  name: string;
  activity: ActivityType;
  appointment?: string;
  teacherName: string;
};

export type StudentProfileData = {
  student: StudentSerialized;
  groups: StudentGroupSummary[];
  attendance: unknown[]; // TODO: typed when Attendance module is ready
  scores: unknown[];     // TODO: typed when Scores module is ready
};

// ─── Fetchers ────────────────────────────────────────────────────────────────

/**
 * Fetches a single student by ID, scoped to the current mosque.
 * Returns null if not found or on error.
 *
 * React cache() deduplicates calls within the same render pass
 * (e.g., generateMetadata + page component).
 */
export const getStudentById = cache(
  async (id: string): Promise<StudentSerialized | null> => {
    try {
      await connectDB();
      const mosqueId = await getMosqueId();

      const student = await Student.findOne({ _id: id, mosqueId }).lean();
      if (!student) return null;

      return serialize(student) as StudentSerialized;
    } catch (error) {
      console.error("[getStudentById]:", error);
      return null;
    }
  },
);

/**
 * Fetches all students for the current mosque, sorted alphabetically.
 * Returns [] on error — never throws — so the page renders safely.
 */
export const getStudentsList = cache(async (): Promise<StudentSerialized[]> => {
  try {
    await connectDB();
    const mosqueId = await getMosqueId();

    const students = await Student.find({ mosqueId }).sort({ name: 1 }).lean();

    return serializeMany(students) as StudentSerialized[];
  } catch (error) {
    console.error("[getStudentsList]:", error);
    return [];
  }
});

/**
 * Fetches a student's full profile including their active group memberships.
 *
 * Key design decision: We query Groups by `studentIds: id` — NOT student.groupIds.
 * The Group document is the single source of truth for membership.
 * student.groupIds is stale and unreliable (not kept in sync).
 *
 * Teacher name is populated inline to avoid a separate fetch round-trip.
 */
export const getStudentProfile = cache(
  async (id: string): Promise<StudentProfileData | null> => {
    try {
      await connectDB();
      const mosqueId = await getMosqueId();

      // Parallel fetch: student + their groups
      const [student, groups] = await Promise.all([
        Student.findOne({ _id: id, mosqueId }).lean(),
        Group.find({ studentIds: id, mosqueId })
          .populate<{ teacherId: { _id: unknown; name: string } | null }>(
            "teacherId",
            "name",
          )
          .select("name activity appointment teacherId")
          .lean(),
      ]);

      if (!student) return null;

      const groupSummaries: StudentGroupSummary[] = groups.map((g) => ({
        _id: g._id.toString(),
        name: g.name,
        activity: g.activity as ActivityType,
        appointment: g.appointment,
        // Handle the case where a teacher was deleted (populate returns null)
        teacherName:
          g.teacherId && typeof g.teacherId === "object" && "name" in g.teacherId
            ? (g.teacherId as { name: string }).name
            : "غير محدد",
      }));

      return {
        student: serialize(student) as StudentSerialized,
        groups: groupSummaries,
        attendance: [],
        scores: [],
      };
    } catch (error) {
      console.error("[getStudentProfile]:", error);
      return null;
    }
  },
);