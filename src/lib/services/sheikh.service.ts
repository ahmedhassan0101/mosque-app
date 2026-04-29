/* eslint-disable @typescript-eslint/no-explicit-any */
// import { cache } from "react";
// import { connectDB } from "@/lib/db/connect";
// import Sheikh from "@/models/Sheikh";
// import Group from "@/models/Group";
// import { getMosqueId } from "@/lib/auth/get-context";

// export async function getSheikhsList() {
//   const mosqueId = await getMosqueId();
//   await connectDB();

//   return Sheikh.find({ mosqueId }).sort({ name: 1 }).lean();
// }

// export async function getGroupsList() {
//   const mosqueId = await getMosqueId();
//   await connectDB();
//   return Group.find({ mosqueId }).sort({ name: 1 }).lean();
// }

// export const getSheikhById = cache(async (id: string) => {
//   const mosqueId = await getMosqueId();
//   await connectDB();

//   return Sheikh.findOne({ _id: id, mosqueId }).lean();
// });

// export async function getGroupsBySheikh(sheikhId: string) {
//   const mosqueId = await getMosqueId();
//   await connectDB();

//   return Group.find({ mosqueId, sheikhId })
//     .populate("studentIds", "name level photo")
//     .lean();
// }

import { cache } from "react";
import { connectDB } from "@/lib/db/connect";
import Sheikh from "@/models/Sheikh";
import Group from "@/models/group.model";
import { getMosqueId } from "@/lib/auth/get-context";
import type {
  SheikhSerialized,
  SheikhWithGroups,
  SheikhProfile,
} from "@/types/serialized";

// ─── Serialize helper ─────────────────────────────────────────
/**
 * Converts a raw Mongoose Sheikh document to a plain serialized object.
 * Called after every .lean() query before passing data to Client Components.
 */
function serializeSheikh(s: any): SheikhSerialized {
  return {
    _id: s._id.toString(),
    mosqueId: s.mosqueId.toString(),
    name: s.name,
    phone: s.phone ?? undefined,
    photo: s.photo ?? undefined,
    notes: s.notes ?? undefined,
    groupId: s.groupId ? s.groupId.toString() : undefined,
    createdAt:
      s.createdAt instanceof Date
        ? s.createdAt.toISOString()
        : String(s.createdAt),
  };
}

// ─── Queries ──────────────────────────────────────────────────

/**
 * getSheikhsList
 * Fetches all sheikhs with their group summary (count only, no students).
 * Used in: /sheikhs list page
 *
 * Single DB call for groups avoids N+1 problem.
 * Mapping done in memory — no extra queries per sheikh.
 */
export async function getSheikhsList(): Promise<SheikhWithGroups[]> {
  const mosqueId = await getMosqueId();
  await connectDB();

  // Parallel fetch — one round trip for both
  const [sheikhs, groups] = await Promise.all([
    Sheikh.find({ mosqueId }).sort({ name: 1 }).lean(),
    Group.find({ mosqueId }).select("name activity sheikhId studentIds").lean(),
  ]);

  return sheikhs.map((s) => {
    const sheikhGroups = groups.filter(
      (g) => g.sheikhId?.toString() === s._id.toString(),
    );
    return {
      ...serializeSheikh(s),
      groups: sheikhGroups.map((g) => ({
        _id: g._id.toString(),
        name: g.name,
        activity: g.activity,
        studentCount: Array.isArray(g.studentIds) ? g.studentIds.length : 0,
      })),
    };
  });
}

/**
 * getSheikhById
 * Fetches a single sheikh — lightweight, no groups.
 *
 * Wrapped in React cache() so generateMetadata + page component
 * both call this but only ONE DB query fires per request.
 *
 * Used in: generateMetadata, /sheikhs/[id]/edit
 */
export const getSheikhById = cache(
  async (id: string): Promise<SheikhSerialized | null> => {
    const mosqueId = await getMosqueId();
    await connectDB();

    const s = await Sheikh.findOne({ _id: id, mosqueId }).lean();
    if (!s) return null;
    return serializeSheikh(s);
  },
);

/**
 * getSheikhProfile
 * Fetches sheikh + groups with populated students.
 * Heavier than getSheikhById — only used on the profile page.
 *
 * Separate from getSheikhById because the edit page doesn't
 * need student data, so we avoid the populate overhead there.
 *
 * Used in: /sheikhs/[id] profile page
 */
export async function getSheikhProfile(
  id: string,
): Promise<SheikhProfile | null> {
  const mosqueId = await getMosqueId();
  await connectDB();

  const [sheikh, groups] = await Promise.all([
    Sheikh.findOne({ _id: id, mosqueId }).lean(),
    Group.find({ mosqueId, sheikhId: id })
      .populate("studentIds", "name level photo")
      .lean(),
  ]);

  if (!sheikh) return null;

  return {
    sheikh: serializeSheikh(sheikh),
    groups: groups.map((g) => ({
      _id: g._id.toString(),
      name: g.name,
      activity: g.activity,
      students: (g.studentIds as any[]).map((s) => ({
        _id: s._id.toString(),
        name: s.name,
        level: s.level as string,
        photo: s.photo ?? null,
      })),
    })),
  };
}
