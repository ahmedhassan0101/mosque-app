import type { ActivityType, levelType, RolesType } from "@/constants";
import { Types } from "mongoose";

/** Shared application-wide types */


/** Standard JSend-style API response */

export interface IUser {
  _id: Types.ObjectId;
  mosqueId: Types.ObjectId | null;
  name: string;
  email: string;
  password: string;
  role: RolesType;
  createdAt: Date;
}

export interface IMosque {
  _id: Types.ObjectId;
  name: string;
  address?: string;
  phone?: string;
  createdAt: Date;
}

/**
 * ITeacher — The canonical interface for a Teacher document.
 * Used as the single source of truth for typing across the app.
 *
 * NOTE: Keep this interface flat and DB-accurate.
 * Serialized variants live in src/types/serialized.ts (TeacherSerialized).
 */
export interface ITeacher {
  _id: Types.ObjectId;
  mosqueId: Types.ObjectId;
  name: string;
  phone?: string;
  image?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGuardian {
  relation: string;
  phone: string;
}
export interface IStudent {
  _id: Types.ObjectId;
  mosqueId: Types.ObjectId;
  name: string;
  birthDate: Date;
  gender: "male" | "female";
  guardians: IGuardian[];
  phone?: string;
  image?: string;
  address?: string;
  level: levelType;
  enrollments?: ActivityType[];
  currentSurah?: string;
  currentAyah?: number;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGroup {
  _id: Types.ObjectId;
  mosqueId: Types.ObjectId;
  name: string;
  teacherId: Types.ObjectId;
  activity: ActivityType;
  studentIds: Types.ObjectId[];
  appointment: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// --------------------------------------------------------
// --------------------------------------------------------
// src/types/session.types.ts

// ─── Behavior Tags ────────────────────────────────────────────────────────────

export const BEHAVIOR_TAGS = [
  "excellent", // ممتاز — سير الحلقة كان رائعاً
  "good", // جيد
  "average", // متوسط
  "noisy", // كثير من الضوضاء / الشغب
  "low_attendance", // إقبال ضعيف
  "discipline", // مشكلات انضباط عامة
  "late_start", // تأخر في بدء الجلسة
] as const;

export type BehaviorTag = (typeof BEHAVIOR_TAGS)[number];

export const BEHAVIOR_TAG_LABELS: Record<BehaviorTag, string> = {
  excellent: "ممتاز",
  good: "جيد",
  average: "متوسط",
  noisy: "ضوضاء / شغب",
  low_attendance: "إقبال ضعيف",
  discipline: "مشكلات انضباط",
  late_start: "تأخر في البدء",
};

export type SessionContent = {
  title?: string;
  book?: string;
  fromSurah?: string;
  fromAyah?: number;
  toSurah?: string;
  toAyah?: number;
};

export interface ISession {
  _id: Types.ObjectId;
  mosqueId: Types.ObjectId;
  groupId: Types.ObjectId;
  activity: ActivityType;
  date: Date;
  teacherId: Types.ObjectId;
  recordedBy: Types.ObjectId;
  attendedStudentIds: Types.ObjectId[];
  content: SessionContent;
  behaviorTags: BehaviorTag[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISession2 {
  lesson?: string;
  lessonBook?: string;

  playgroundTime?: string;
  playgroundIssues?: string[];

  mvpStudents?: Types.ObjectId[];
  // General
  positives?: string;
  negatives?: string;

  notes?: string;
  photos?: string[];
  createdAt: Date;
}

export interface IAttendance {
  _id: Types.ObjectId;
  mosqueId: Types.ObjectId;
  sessionId: Types.ObjectId;
  studentId: Types.ObjectId;
  activity: ActivityType;
  date: Date;
  present: boolean;
}
