// src/lib/db/serialize.ts

import type { Serialize } from "@/types/serialized";

/**
 * Serializes a Mongoose lean document (or any plain object) into a
 * JSON-safe object safe for crossing the Server → Client boundary.
 *
 * Uses JSON round-trip to:
 *   1. Convert ObjectId → string
 *   2. Convert Date → ISO string
 *   3. Strip any non-serializable prototype methods
 *
 * IMPORTANT: Always call `.lean()` in Mongoose queries before passing
 * the result here. `.lean()` strips Mongoose Document methods and makes
 * the object a plain JS object, which JSON.stringify can handle safely.
 *
 * @param data - The raw Mongoose lean document or plain object.
 * @returns A fully serialized, client-safe version of the data.
 */
export function serialize<T>(data: T): Serialize<T> {
  // Guard: return early for null/undefined to avoid crashes
  if (data === null || data === undefined) return data as Serialize<T>;

  // JSON round-trip is the safest, fastest serializer for Mongoose lean docs.
  // No need to call .toObject() because we always use .lean() upstream.
  return JSON.parse(JSON.stringify(data)) as Serialize<T>;
}

/**
 * Serializes an array of Mongoose lean documents.
 * Returns an empty array (never undefined) to prevent client-side crashes.
 *
 * @param items - Array of raw Mongoose lean documents.
 * @returns Array of serialized, client-safe objects.
 */
export function serializeMany<T>(items: T[]): Serialize<T>[] {
  if (!Array.isArray(items)) return [];
  return items.map(serialize);
}



// old

// export function serialize<T>(data: T): Serialize<T> {
//   if (!data) return data as Serialize<T>;
  
//   const plainData = (data as any).toObject 
//     ? (data as any).toObject({ virtuals: true }) 
//     : data;

//   const cleanData = JSON.parse(JSON.stringify(plainData));

//   if (cleanData._id && !cleanData.id) {
//     cleanData.id = cleanData._id.toString();
//   }
//   return cleanData as Serialize<T>;
// }
