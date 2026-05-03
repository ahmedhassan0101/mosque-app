// src/types/serialized.ts
import type { Types } from "mongoose";

import { IGroup, IStudent, ITeacher } from ".";

/**
 * Serialize<T>
 *
 * Recursively converts Mongoose-specific types to JSON-safe primitives.
 * This prevents hydration errors when passing data from Server → Client Components.
 *
 * Recursively converts Mongoose-specific types to JSON-safe primitives.
 * Handles: ObjectId → string, Date → string, null variants, nested objects,
 * and arrays of serializable items.
 *
 * Handles:
 *   - ObjectId              → string
 *   - Date                  → string
 *   - ObjectId | undefined  → string | undefined
 *   - Date | null           → string | null   (supports nullable fields)
 *   - Nested objects        → Serialize<NestedObject>
 *   - Arrays                → Array<Serialize<Item>>
 *   - Primitives            → unchanged
 */
export type Serialize<T> = {
  [K in keyof T]: T[K] extends Types.ObjectId
    ? string
    : T[K] extends Date
      ? string
      : T[K] extends Types.ObjectId | undefined
        ? string | undefined
        : T[K] extends Types.ObjectId | null
          ? string | null
          : T[K] extends Date | undefined
            ? string | undefined
            : T[K] extends Date | null
              ? string | null
              : T[K] extends Array<infer U>
                ? Array<Serialize<U>>
                : T[K] extends object
                  ? Serialize<T[K]>
                  : T[K];
};

// ─── Centralized Serialized Types ──────────────────────────────────────────
// Single source of truth — import these everywhere instead of re-deriving.

export type TeacherSerialized = Serialize<ITeacher>;
export type StudentSerialized = Serialize<IStudent>;
export type GroupSerialized = Serialize<IGroup>;
