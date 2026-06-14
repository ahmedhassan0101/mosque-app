// src/lib/data/student.data.ts
import { cache } from "react";
import { getMosqueId } from "@/lib/auth/get-context";
import { connectDB } from "@/lib/db/client";
import Student from "@/models/student.model";
import { serialize, serializeMany } from "@/lib/utils/serialize";
import type { StudentSerialized } from "@/types/serialized";
import Group from "@/models/group.model";
import type { ActivityType, levelType } from "@/constants";

// Re-export for convenience
export type { StudentSerialized };

// ─── Types ───────────────────────────────────────────────────────────
export type StudentsFilters = {
  query?: string;
  level?: levelType | "all";
  activity?: ActivityType | "all";
  page?: number;
  limit?: number;
  sortBy?: "name" | "birthDate" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export type StudentsListResult = {
  students: StudentSerialized[];
  totalCount: number;
  totalPages: number;
  activeCount: number;
  activityStats: Record<ActivityType, number>;
};

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
  scores: unknown[]; // TODO: typed when Scores module is ready
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

/**
 * Fetches a paginated, filtered, and sorted list of students.
 *
 * All filtering happens in MongoDB — never loads all students into memory.
 *
 * activityStats: uses a separate aggregation pipeline so the count reflects
 * the TOTAL dataset, not the current page — giving accurate stats cards.
 */
export const getStudentsList = cache(
  async (filters: StudentsFilters = {}): Promise<StudentsListResult> => {
    const {
      query,
      level,
      activity,
      page = 1,
      limit = 20,
      sortBy = "name",
      sortOrder = "asc",
    } = filters;

    const emptyResult: StudentsListResult = {
      students: [],
      totalCount: 0,
      totalPages: 1,
      activeCount: 0,
      activityStats: {
        quran: 0,
        tarbiya: 0,
        tajweed: 0,
        maqraa: 0,
        playground: 0,
      },
    };

    try {
      await connectDB();
      const mosqueId = await getMosqueId();

      // ── Build the base filter ──────────────────────────────────────────
      const filter: Record<string, unknown> = { mosqueId };

      if (query && query.trim()) {
        // Case-insensitive Arabic-safe regex search on name
        filter.name = { $regex: query.trim(), $options: "i" };
      }

      if (level && level !== "all") {
        filter.level = level;
      }

      if (activity && activity !== "all") {
        // enrollments is an array — $elemMatch or direct value match both work
        filter.enrollments = activity;
      }

      // ── Sort direction ─────────────────────────────────────────────────
      const sortDirection = sortOrder === "asc" ? 1 : -1;
      const sortObj: Record<string, 1 | -1> = { [sortBy]: sortDirection };

      // ── Pagination math ────────────────────────────────────────────────
      const skip = (page - 1) * limit;

      // ── Run queries in parallel ────────────────────────────────────────
      const [students, totalCount, activeCount, activityAgg] =
        await Promise.all([
          // 1. Paginated, filtered, sorted students
          Student.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),

          // 2. Total count for this filter (for pagination math)
          Student.countDocuments({ mosqueId }),

          // 3. Active count across the FULL dataset (not filtered)
          Student.countDocuments({ mosqueId, isActive: true }),

          // 4. Enrollment stats across the FULL dataset
          // $unwind flattens the enrollments array so we can $group by value
          Student.aggregate<{ _id: ActivityType; count: number }>([
            { $match: { mosqueId } },
            {
              $unwind: {
                path: "$enrollments",
                preserveNullAndEmptyArrays: false,
              },
            },
            { $group: { _id: "$enrollments", count: { $sum: 1 } } },
          ]),
        ]);
      console.log("🚀 ~ activityAgg:", activityAgg);

      const activityStats = { ...emptyResult.activityStats };
      for (const item of activityAgg) {
        if (item._id in activityStats) activityStats[item._id] = item.count;
      }

      return {
        students: serializeMany(students) as StudentSerialized[],
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / limit)),
        activeCount,
        activityStats,
      };
    } catch (error) {
      console.error("[getStudentsList]:", error);
      return emptyResult;
    }
  },
);

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
          .populate<{
            teacherId: { _id: unknown; name: string } | null;
          }>("teacherId", "name")
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
          g.teacherId &&
          typeof g.teacherId === "object" &&
          "name" in g.teacherId
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

/** Minimal student shape needed for the attendance list */
export type AttendanceStudentOption = {
  _id: string;
  name: string;
};

/**
 * Fetches students belonging to the given group IDs.
 * Called from a Server Action triggered when the user changes group selection.
 * Returns only _id and name — no over-fetching.
 */
export async function getStudentsOptionsByGroupIds(
  groupIds: string[],
): Promise<AttendanceStudentOption[]> {
  if (groupIds.length === 0) return []; // validate like id

  try {
    await connectDB();
    const mosqueId = await getMosqueId();

    // 1. Get the studentIds from each selected group
    const groups = await Group.find(
      { _id: { $in: groupIds }, mosqueId },
      { studentIds: 1 },
    ).lean();

    // 2. Collect unique student IDs across all selected groups
    const uniqueStudentIds = [
      ...new Set(
        groups.flatMap((g) => g.studentIds.map((id) => id.toString())),
      ),
    ];

    if (uniqueStudentIds.length === 0) return [];

    // 3. Fetch only name + _id — never over-fetch for a dropdown/list
    const students = await Student.find(
      { _id: { $in: uniqueStudentIds }, mosqueId },
      { name: 1 },
    )
      .sort({ name: 1 })
      .lean();

    return students.map((s) => ({
      _id: s._id.toString(),
      name: s.name,
    }));
  } catch (error) {
    console.error("[getStudentsByGroupIds]:", error);
    return [];
  }
}
