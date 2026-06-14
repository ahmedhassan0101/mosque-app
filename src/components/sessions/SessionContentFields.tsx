// src/components/sessions/SessionContentFields.tsx
"use client";

import type { Control } from "react-hook-form";
import type { SessionInput } from "@/schemas/session.schema";
import type { ActivityType } from "@/constants";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { SURAH_OPTIONS } from "@/constants/quran";

interface SessionContentFieldsProps {
  control: Control<SessionInput>;
  activity: ActivityType | undefined;
}

// ─── Activity groupings ───────────────────────────────────────────────────────

/**
 * Activities that show the Surah range (from/to) fields.
 * maqraa only.
 */
const SURAH_RANGE_ACTIVITIES: ActivityType[] = ["maqraa"];

/**
 * Activities that show the lesson title + optional book fields.
 * tajweed, tarbiya, playground.
 */
const LESSON_TITLE_ACTIVITIES: ActivityType[] = [
  "tajweed",
  "tarbiya",
  "playground",
];

const LESSON_PLACEHOLDER: Partial<Record<ActivityType, string>> = {
  tarbiya: "مثال: درس الصدق",
  tajweed: "مثال: أحكام النون الساكنة",
  playground: "مثال: كرة القدم",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function SessionContentFields({
  control,
  activity,
}: SessionContentFieldsProps) {
  // No activity selected yet — render nothing
  if (!activity) return null;

  const showSurahRange = SURAH_RANGE_ACTIVITIES.includes(activity);
  const showLessonTitle = LESSON_TITLE_ACTIVITIES.includes(activity);

  // quran has no extra content fields in the simplified schema
  if (!showSurahRange && !showLessonTitle) return null;

  return (
    <section className="space-y-4 p-5 rounded-xl border border-border bg-card">
      <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">
        محتوى الجلسة
      </h3>

      {/* ── Surah range: maqraa ── */}
      {showSurahRange && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              control={control}
              name="content.fromSurah"
              label="من سورة"
              options={SURAH_OPTIONS}
              required
            />
            <FormInput
              control={control}
              name="content.fromAyah"
              label="من آية"
              type="number"
              placeholder="١"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              control={control}
              name="content.toSurah"
              label="إلى سورة"
              options={SURAH_OPTIONS}
              required
            />
            <FormInput
              control={control}
              name="content.toAyah"
              label="إلى آية"
              type="number"
              placeholder="٧"
            />
          </div>
        </>
      )}

      {/* ── Lesson title: tajweed, tarbiya, playground ── */}
      {showLessonTitle && (
        <>
          <FormInput
            control={control}
            name="content.title"
            label={activity === "playground" ? "كلمة الملعب" : "عنوان الدرس"}
            placeholder={LESSON_PLACEHOLDER[activity] ?? ""}
            required={activity !== "playground"}
          />
          <FormInput
            control={control}
            name="content.book"
            label="المرجع / الكتاب"
            placeholder="مثال: منهج التربية الإسلامية"
          />
        </>
      )}
    </section>
  );
}
