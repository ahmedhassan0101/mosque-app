import { Types } from "mongoose";

/** Shared application-wide types */
export const ACTIVITIES = [
  "quran",
  "tarbiya",
  "tajweed",
  "maqraa",
  "playground",
] as const;
export type ActivityType = (typeof ACTIVITIES)[number];

export const STUDENT_LEVEL = ["beginner", "intermediate", "advanced"] as const;
export type StudentLevel = (typeof STUDENT_LEVEL)[number];

export type AchievementLevel = "weak" | "average" | "good" | "excellent";

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  quran: "قرآن كريم",
  tarbiya: "التربية",
  tajweed: "التجويد",
  maqraa: "المقرأة",
  playground: "الأنشطة",
};


// export type UserRole = "superadmin" | "admin" | "sheikh" | "supervisor";

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "SUPERVISOR";
export type Provider = "credentials" | "google";
/** Standard JSend-style API response */

export interface IUser {
  _id: Types.ObjectId;
  mosqueId: Types.ObjectId | null;
  name: string;
  email: string;
  password: string;
  role: UserRole;
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
  level: StudentLevel;
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

export interface ISession {
  _id: Types.ObjectId;
  mosqueId: Types.ObjectId;
  activity: ActivityType;
  date: Date;
  attendingSheikhIds: Types.ObjectId[];
  recordedBy: Types.ObjectId;
  presentStudentIds: Types.ObjectId[];
  // Quran specific
  quranFrom?: { surah: string; ayah: number };
  quranTo?: { surah: string; ayah: number };
  // Tarbiya specific
  lesson?: string;
  lessonBook?: string;
  explainingSheikh?: Types.ObjectId;
  participatingStudents?: Types.ObjectId[];
  // Tajweed specific
  tajweedLesson?: string;
  // Playground specific
  playgroundTime?: string;
  speechTopic?: string;
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

export type GroupMinimal = {
  _id: string;
  name: string;
  activity: string;
  studentCount: number;
};

export type SheikhWithGroups = {
  _id: string;
  name: string;
  phone?: string;
  photo?: string;
  groups: GroupMinimal[];
};
