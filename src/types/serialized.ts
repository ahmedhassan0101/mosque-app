// src/types/serialized.ts

import type { Types } from "mongoose";
import type { ISheikh, IStudent, IGroup } from "./index";
/**
 * Serialize<T> — converts Mongoose types to JSON-safe primitives
 *
 * Problem: Mongoose returns ObjectId and Date objects.
 * These cannot be passed from Server → Client Components directly.
 * Solution: map each field to its serialized equivalent.
 *
 * How it works:
 * - Iterate over every key K in type T  →  [K in keyof T]
 * - For each field, check its type and replace if needed
 * - Non-matching types pass through unchanged  →  : T[K]
 */

/**
 * Serialize<T>
 * Converts Mongoose-specific types to JSON-safe primitives.
 *
 * Mongoose returns ObjectId and Date — both break when passed
 * from Server Components to Client Components.
 *
 * Mapped type: iterates every key K in T and replaces:
 *   ObjectId             → string
 *   Date                 → string
 *   ObjectId | undefined → string | undefined
 *   Date | undefined     → string | undefined
 *   anything else        → unchanged
 */
// type Serialize<T> = {
//   [K in keyof T]: T[K] extends Types.ObjectId // ObjectId (required) → string
//     ? string
//     : // Date (required) → string
//       T[K] extends Date
//       ? string
//       : // ObjectId (optional) → string | undefined
//         T[K] extends Types.ObjectId | undefined
//         ? string | undefined
//         : // Date (optional) → string | undefined
//           T[K] extends Date | undefined
//           ? string | undefined
//           : // everything else (string, number, boolean, arrays) → unchanged
//             T[K];
// };
// type Serialize<T> = {
//   [K in keyof T]: T[K] extends Types.ObjectId
//     ? string
//     : T[K] extends Date
//       ? string
//       : T[K] extends Types.ObjectId | undefined
//         ? string | undefined
//         : T[K] extends Date | undefined
//           ? string | undefined
//           : T[K];
// };
export type Serialize<T> = {
  [K in keyof T]: T[K] extends Types.ObjectId
    ? string
    : T[K] extends Date
      ? string
      : T[K] extends Types.ObjectId | undefined
        ? string | undefined
        : T[K] extends Date | undefined
          ? string | undefined
          : T[K] extends Array<infer U>
            ? Array<Serialize<U>>
            : T[K];
};

// export type Serialize<T> = T extends Date
//   ? string
//   : T extends Types.ObjectId
//   ? string
//   : T extends object
//   ? {
//       [K in keyof T]: Serialize<T[K]>;
//     }
//   : T;


// ─── Base serialized models ────────────────────────────────────────────────
// Direct 1-to-1 mapping from the Mongoose interface
// No need to rewrite every field manually

export type SheikhSerialized = Serialize<ISheikh>;
export type StudentSerialized = Serialize<IStudent>;
export type IGroupSerialized = Serialize<IGroup>;

// ── Composed types ────────────────────────────────────────────

// ─── Composed types (server computes, client displays) ────────────────────
// Only define what's NOT already in the base model

/** Used in /sheikhs list page — sheikh card with group summary */
export type SheikhWithGroups = SheikhSerialized & {
  groups: {
    _id: string;
    name: string;
    activity: string;
    studentCount: number;
  }[];
};

/** Used in /sheikhs/[id] profile page — full profile with students inside groups */
export type SheikhProfile = {
  sheikh: SheikhSerialized;
  groups: {
    _id: string;
    name: string;
    activity: string;
    students: {
      _id: string;
      name: string;
      level: string;
      photo: string | null;
    }[];
  }[];
};

/** Used in /students list page */
export type StudentsListResult = {
  students: StudentSerialized[];
  total: number;
  totalPages: number;
};
