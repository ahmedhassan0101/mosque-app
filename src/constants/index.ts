// src/constants/index.ts

export const ACTIVITIES = [
  "quran",
  "tarbiya",
  "tajweed",
  "maqraa",
  "playground",
] as const;

export type ActivityType = (typeof ACTIVITIES)[number];
