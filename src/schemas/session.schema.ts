// src/schemas/session.schema.ts
import { z } from "zod";
import { BEHAVIORS } from "@/constants";
import {
  activitySchema,
  ayahSchema,
  dateSchema,
  noteSchema,
  stringSchema,
} from "./global.schema";

// ─── Content sub-schema ───────────────────────────────────────────────────────

const contentSchema = z.object({
  title: stringSchema,
  book: stringSchema,
  fromSurah: stringSchema,
  fromAyah: ayahSchema,
  toSurah: stringSchema,
  toAyah: ayahSchema,
});

// ─── Main schema ──────────────────────────────────────────────────────────────

export const sessionSchema = z
  .object({
    groupIds: z
      .array(z.string().min(1, "معرّف المجموعة غير صالح."))
      .min(1, "يجب اختيار مجموعة واحدة على الأقل."),
    activity: activitySchema, // done
    date: dateSchema, // done
    teacherId: z
      .string({ message: "يرجى اختيار المعلم." })
      .min(1, "يرجى اختيار المعلم."),
    attendedStudentIds: z.array(z.string()),
    content: contentSchema, // done
    behaviorTags: z.array(
      z.enum(BEHAVIORS.values, { message: "تصنيف غير صالح." }), // done
    ),
    notes: noteSchema, // done
  })

  /**
   * Cross-field validation: required content per activity type.
   *
   * Why here and not in the content sub-schema?
   * Because the content sub-schema has no knowledge of `activity`.
   * superRefine has access to the full object — the right place for
   * cross-field rules.
   */

  .superRefine((data, ctx) => {
    const { activity, content } = data;

    // maqraa require a surah range
    if (activity === "maqraa") {
      if (!content.fromSurah?.trim()) {
        ctx.addIssue({
          code: "custom",
        
          path: ["content", "fromSurah"],
          message: "سورة البداية مطلوبة لهذا النشاط.",
        });
      }
      if (!content.toSurah?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["content", "toSurah"],
          message: "سورة النهاية مطلوبة لهذا النشاط.",
        });
      }
    }

    // tajweed and tarbiya require a lesson title
    if (activity === "tajweed" || activity === "tarbiya") {
      if (!content.title?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["content", "title"],
          message: "عنوان الدرس مطلوب لهذا النشاط.",
        });
      }
    }
  });

// ─── Derived types ────────────────────────────────────────────────────────────

export type SessionInput = z.infer<typeof sessionSchema>;

/**
 * Shape of a single session document ready for DB insertion.
 * Produced by the Server Action after splitting groupIds → groupId.
 */
export type SingleSessionPayload = Omit<SessionInput, "groupIds"> & {
  groupId: string;
  mosqueId: string;
  recordedBy: string;
};
