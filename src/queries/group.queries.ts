// src/lib/data/group.data.ts
import { cache } from "react";
import { connectDB } from "@/lib/db/client";
import Group from "@/models/group.model";
import { getMosqueId } from "@/lib/auth/get-context";
import { serialize } from "@/lib/utils/serialize";
import type { GroupSerialized } from "@/types/serialized";
import { ActivityType } from "@/constants";

export type { GroupSerialized };

// ─── Derived types for populated queries ────────────────────────────────────
/**
 * Used in the list/grid view — teacher name flattened, studentIds replaced with count.
 *
 * THE FIX: GroupListItem must NOT extend Omit<GroupSerialized, "studentIds">
 * because GroupSerialized still has `teacherId` as a required field.
 * After the mapping, teacherId is gone and replaced by teacherName.
 * We define the type explicitly to match exactly what the mapping produces.
 */
export type GroupListItem = {
  _id: string;
  mosqueId: string;
  name: string;
  activity: ActivityType;
  appointment: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  teacherName: string;
  studentCount: number;
};

/** Minimal group shape needed for the form selects */
export type GroupOption = {
  _id: string;
  name: string;
  activity: ActivityType;
};

/**
 * A group with fully populated students and teacher — used in the detail view.
 */
/** Used in the detail/profile page — full populate. */
export type GroupWithDetails = Omit<
  GroupSerialized,
  "teacherId" | "studentIds"
> & {
  teacher: { _id: string; name: string; phone?: string } | null;
  students: { _id: string; name: string; phone?: string; image?: string }[];
};

// ─── Fetchers ────────────────────────────────────────────────────────────────

/**
 * Fetches a single group by ID, scoped to the current mosque.
 * Returns null if not found or on error.
 * Fetches a single group by ID with NO population.
 * Used for: Edit form initial data (needs raw IDs for the checkboxes).
 */
export const getGroupById = cache(
  async (id: string): Promise<GroupSerialized | null> => {
    try {
      await connectDB();
      const mosqueId = await getMosqueId();

      const group = await Group.findOne({ _id: id, mosqueId }).lean();
      if (!group) return null;

      return serialize(group) as GroupSerialized;
    } catch (error) {
      console.error("[getGroupById]:", error);
      return null;
    }
  },
);

/**
 * Fetches groups list for a given activity type.
 * Populates: teacher name only (for display).
 * Returns: studentCount instead of full studentIds array (no over-fetching).
 *
 * Why not populate students here?
 * A list card only needs a count. Fetching full student docs for every group
 * in a list of 20 groups would be a massive over-fetch.
 * Full student details are fetched only in the detail page via getGroupWithDetails.
 */
/**
 * Fetches all groups for a given activity type with teacher name populated.
 * Returns studentCount (array length) instead of full studentIds.
 *
 * THE FIX EXPLAINED:
 * The previous code spread `serialize(rest)` which TypeScript couldn't reconcile
 * with GroupListItem because `teacherId` was still required in the inferred spread type.
 * Solution: Build the return object field-by-field with explicit typing so TypeScript
 * knows exactly what shape we're producing — no spread ambiguity.
 */

export const getGroupsList = cache(
  async (type: ActivityType): Promise<GroupListItem[]> => {
    try {
      await connectDB();
      const mosqueId = await getMosqueId();

      const groups = await Group.find({ mosqueId, activity: type })
        .sort({ createdAt: -1 })
        .populate<{
          teacherId: { _id: unknown; name: string } | null;
        }>("teacherId", "name")
        .lean();

      return groups.map((group): GroupListItem => {
        const {
          teacherId,
          studentIds,
          _id,
          mosqueId,
          createdAt,
          updatedAt,
          ...rest
        } = group;

        return {
          _id: (_id as { toString(): string }).toString(),
          mosqueId: (mosqueId as { toString(): string }).toString(),
          name: rest.name,
          activity: rest.activity as ActivityType,
          appointment: rest.appointment ?? "",
          notes: rest.notes,
          createdAt:
            createdAt instanceof Date
              ? createdAt.toISOString()
              : String(createdAt),
          updatedAt:
            updatedAt instanceof Date
              ? updatedAt.toISOString()
              : String(updatedAt),
          // Safe access — teacher might be null if they were deleted
          teacherName:
            teacherId !== null &&
            typeof teacherId === "object" &&
            "name" in teacherId
              ? teacherId.name
              : "غير محدد",
          studentCount: Array.isArray(studentIds) ? studentIds.length : 0,
        };
      });
    } catch (error) {
      console.error("[getGroupsList]:", error);
      return [];
    }
  },
);

/**
 * Fetches groups for the session form, optionally filtered by activity.
 * Used by the New/Edit session pages.
 */
export const getGroupOptions = cache(async (): Promise<GroupOption[]> => {
  try {
    await connectDB();
    const mosqueId = await getMosqueId();

    const groups = await Group.find(
      { mosqueId },
      {
        name: 1,
        activity: 1,
      },
    )
      .sort({ name: 1 })
      .lean();

    return groups.map((g) => ({
      _id: g._id.toString(),
      name: g.name,
      activity: g.activity,
      // studentIds: g.studentIds.map((id) => id.toString())
    }));
  } catch (error) {
    console.error("[getGroupOptions]:", error);
    return [];
  }
});

/**
 * Fetches a single group with FULL population of teacher and students.
 * Used for: Group detail/profile page only.
 *
 * Separate from getGroupById intentionally — different data shapes for
 * different use cases prevents over-fetching in the edit form.
 * Teacher may be null if deleted — we handle this gracefully.
 */
export const getGroupWithDetails = cache(
  async (id: string): Promise<GroupWithDetails | null> => {
    try {
      await connectDB();
      const mosqueId = await getMosqueId();

      const group = await Group.findOne({ _id: id, mosqueId })
        .populate<{
          teacherId: { _id: unknown; name: string; phone?: string } | null;
        }>("teacherId", "name phone")
        .populate<{
          studentIds: {
            _id: unknown;
            name: string;
            phone?: string;
            image?: string;
          }[];
        }>("studentIds", "name phone image")
        .lean();

      if (!group) return null;

      const {
        teacherId,
        studentIds,
        _id,
        mosqueId: mid,
        createdAt,
        updatedAt,
        ...rest
      } = group;

      return {
        _id: (_id as { toString(): string }).toString(),
        mosqueId: (mid as { toString(): string }).toString(),
        createdAt:
          createdAt instanceof Date
            ? createdAt.toISOString()
            : String(createdAt),
        updatedAt:
          updatedAt instanceof Date
            ? updatedAt.toISOString()
            : String(updatedAt),
        ...rest,
        activity: rest.activity as ActivityType,
        // Teacher null-safe: returns null object if teacher was deleted

        teacher:
          teacherId !== null &&
          typeof teacherId === "object" &&
          "name" in teacherId
            ? {
                _id: (teacherId._id as { toString(): string }).toString(),
                name: teacherId.name,
                phone: teacherId.phone,
              }
            : null,
        students: Array.isArray(studentIds)
          ? studentIds.map((s) => ({
              _id: (s._id as { toString(): string }).toString(),
              name: s.name,
              phone: s.phone,
              image: s.image,
            }))
          : [],
      };
    } catch (error) {
      console.error("[getGroupWithDetails]:", error);
      return null;
    }
  },
);
