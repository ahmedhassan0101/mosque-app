// src\lib\data\teacher.data.ts
import { cache } from "react";
import { getMosqueId } from "@/lib/auth/get-context";
import { connectDB } from "@/lib/db/client";
import Teacher from "@/models/teacher.model";
import { serialize, serializeMany } from "@/lib/utils/serialize";
import type { TeacherSerialized } from "@/types/serialized";
import type { ActivityType } from "@/constants";
import Group from "@/models/group.model";

// Re-export for convenience so consumers import from one place
export type { TeacherSerialized };
// ─── Derived Types ───────────────────────────────────────────────────────────

/**
 * A lightweight group summary shown on the teacher's profile.
 * Contains only what's needed for display — no full student objects.
 */
export type TeacherGroupSummary = {
  _id: string;
  name: string;
  activity: ActivityType;
  appointment?: string;
  studentCount: number;
};

export type TeacherProfileData = {
  teacher: TeacherSerialized;
  groups: TeacherGroupSummary[];
  /** Total students across all groups (may overlap — same student in multiple groups) */
  totalStudents: number;
};

/**
 * Fetches a single teacher by ID, scoped to the current mosque.
 * Returns null if not found or on error (safe default for notFound() handling).
 *
 * Uses React `cache()` to deduplicate calls within a single render pass
 * (e.g., generateMetadata + page component both calling this).
 */

export const getTeacherById = cache(
  async (id: string): Promise<TeacherSerialized | null> => {
    try {
      await connectDB();
      const mosqueId = await getMosqueId();

      // .lean() returns a plain JS object — required before serialize()
      const teacher = await Teacher.findOne({ _id: id, mosqueId }).lean();

      if (!teacher) return null;

      return serialize(teacher) as TeacherSerialized;
    } catch (error) {
      console.error("[getTeacherById]:", error);
      return null;
    }
  },
);

/**
 * Fetches all teachers for the current mosque, sorted alphabetically.
 * Returns an empty array on error — never throws — so the page renders safely.
 */

export const getTeachersList = cache(async (): Promise<TeacherSerialized[]> => {
  try {
    await connectDB();
    const mosqueId = await getMosqueId();

    const teachers = await Teacher.find({ mosqueId }).sort({ name: 1 }).lean();

    return serializeMany(teachers) as TeacherSerialized[];
  } catch (error) {
    console.error("[getTeachersList]:", error);
    return [];
  }
});

/**
 * Fetches a teacher's full profile including their associated groups.
 * Composes getTeacherById to avoid duplicating the serialization logic.
 *
 * Returns null if the teacher doesn't exist.
 *
 * TODO: Populate `groups` once the Group data fetcher is ready.
 */

/**
 * Fetches a teacher's full profile with all their groups and student counts.
 *
 * Design decisions:
 * - We fetch groups directly by `teacherId` — NOT by `teacher.groupIds`.
 *   The group document is the single source of truth for membership.
 *   teacher.groupIds would require keeping it in sync manually (error-prone).
 *
 * - We return `studentCount` per group (array length), NOT the full student objects.
 *   The profile page shows a summary card per group, not a full student list.
 *   Full student list is fetched only when the user opens the group detail page.
 *
 * - `totalStudents` counts array lengths across groups (may double-count a student
 *   in two groups). This is intentional — it reflects "slots", not unique students.
 *   If you need unique count, use a Set on the IDs.
 */
export const getTeacherProfile = cache(
  async (id: string): Promise<TeacherProfileData | null> => {
    try {
      await connectDB();
      const mosqueId = await getMosqueId();

      // Parallel fetch: teacher + their groups
      // Both are scoped to mosqueId for tenancy safety
      const [teacher, groups] = await Promise.all([
        Teacher.findOne({ _id: id, mosqueId }).lean(),
        Group.find({ teacherId: id, mosqueId })
          .sort({ createdAt: -1 })
          .select("name activity appointment studentIds")
          .lean(),
      ]);

      if (!teacher) return null;

      const groupSummaries: TeacherGroupSummary[] = groups.map((g) => ({
        _id: g._id.toString(),
        name: g.name,
        activity: g.activity as ActivityType,
        appointment: g.appointment,
        studentCount: g.studentIds?.length ?? 0,
      }));

      const totalStudents = groupSummaries.reduce(
        (sum, g) => sum + g.studentCount,
        0,
      );

      return {
        teacher: serialize(teacher) as TeacherSerialized,
        groups: groupSummaries,
        totalStudents,
      };
    } catch (error) {
      console.error("[getTeacherProfile]:", error);
      return null;
    }
  },
);
// export const getTeacherProfile = cache(async (id: string) => {
//   try {
//     // Reuses getTeacherById — React cache() deduplicates the DB call
//     // if this is called in the same render as getTeacherById(id).
//     const teacher = await getTeacherById(id);
//     if (!teacher) return null;

//     return {
//       teacher,
//       groups: [] as GroupSerialized[], // TODO: fetch via getGroupsByTeacherId(id)
//     };
//   } catch (error) {
//     console.error("[getTeacherProfile]:", error);
//     return null;
//   }
// });

// // Temporary type until groups module is wired up
// type GroupSerialized = { _id: string; name: string };
