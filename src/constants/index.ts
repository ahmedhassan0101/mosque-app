// src/constants/index.ts

type OptionsMap = Record<string, string>;

export function createOptions<const T extends OptionsMap>(data: T) {
  return {
    labels: data,

    values: Object.keys(data) as (keyof T)[],

    options: Object.entries(data).map(([value, label]) => ({
      value,
      label,
    })) as {
      value: keyof T;
      label: string;
    }[],
  };
}

export const ACTIVITIES = createOptions({
  quran: "القرآن الكريم",
  tarbiya: "التربية",
  tajweed: "التجويد",
  maqraa: "المقرأة",
  playground: "الملعب",
});

export const BEHAVIORS = createOptions({
  excellent: "ممتاز",
  good: "جيد",
  average: "متوسط",
  noisy: "ضوضاء / شغب",
  low_attendance: "إقبال ضعيف",
  discipline: "مشكلات انضباط",
  late_start: "تأخر في البدء",
});

export const GENDERS = createOptions({
  male: "ذكر",
  female: "أنثى",
});

export const LEVELS = createOptions({
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
});
export const ROLES = createOptions({
  ADMIN: "مدير",
  SUPERVISOR: "مشرف",
  SUPER_ADMIN: "مدير عام",
});


export type ActivityType = keyof typeof ACTIVITIES.labels;
export type BehaviorType = keyof typeof BEHAVIORS.labels;
export type GenderType = keyof typeof GENDERS.labels;
export type levelType = keyof typeof LEVELS.labels;
export type RolesType = keyof typeof ROLES.labels;
export type Provider = "credentials" | "google";

/** Required marker shown in the header row */
export const REQUIRED_MARKER = " *";


// src/constants/import.ts
/**
 * Shared constants for the student bulk import feature.
 * Centralized here so template columns, dropdowns, and limits
 * never drift between the parser, template generator, and validator.
 */

export const IMPORT_LIMITS = {
  MAX_FILE_SIZE_MB: 5,
  MAX_ROWS: 500,
} as const;

/**
 * Replace this with your actual Google Sheet URL after sharing it.
 * Steps: Open Sheet → Share → Anyone with link → Viewer → Copy link.
 * No API key or OAuth needed — it's a public read-only link.
 * "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing";
 */
export const GOOGLE_SHEET_TEMPLATE_URL =
  "https://docs.google.com/spreadsheets/d/1Mc3Tze2t1B8R-zHCggNwM2PQJuVnVi7OBhPBKDdoCsg/edit?usp=sharing";

/** Arabic column headers exactly as they appear in the Excel template */
export const COLUMN_HEADERS = {
  NAME: "الاسم",
  GENDER: "الجنس",
  BIRTH_DATE: "تاريخ الميلاد",
  LEVEL: "المستوى",
  PHONE: "هاتف الطالب",
  GUARDIAN_RELATION: "صلة القرابة (ولي الأمر)",
  GUARDIAN_PHONE: "هاتف ولي الأمر",
  ADDRESS: "العنوان",
  CURRENT_SURAH: "السورة الحالية",
  CURRENT_AYAH: "رقم الآية",
  NOTES: "ملاحظات",
} as const;


