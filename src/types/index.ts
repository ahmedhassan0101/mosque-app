import { Types } from "mongoose";

export type ActivityType = "quran" | "tarbiya" | "tajweed" | "maqraa" | "playground";
export type StudentLevel = "beginner" | "intermediate" | "advanced";
export type AchievementLevel = "weak" | "average" | "good" | "excellent";

export interface IMosque {
  _id: Types.ObjectId;
  name: string;
  address?: string;
  phone?: string;
  createdAt: Date;
}

export interface IUser {
  _id: Types.ObjectId;
  mosqueId: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "admin" | "sheikh" | "supervisor";
  createdAt: Date;
}

export interface IStudent {
  _id: Types.ObjectId;
  mosqueId: Types.ObjectId;
  name: string;
  birthYear: number;
  phone?: string;
  guardianName?: string;
  guardianPhone: string;
  guardianPhone2?: string;
  photo?: string;
  address?: string;
  level: StudentLevel;
  groupId?: Types.ObjectId;
  enrollments: ActivityType[];
  trackIbadah: boolean;
  currentSurah?: string;
  currentAyah?: number;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ISheikh {
  _id: Types.ObjectId;
  mosqueId: Types.ObjectId;
  name: string;
  phone?: string;
  groupId?: Types.ObjectId;
  createdAt: Date;
}

export interface IGroup {
  _id: Types.ObjectId;
  mosqueId: Types.ObjectId;
  name: string;
  sheikhId: Types.ObjectId;
  activity: ActivityType;
  studentIds: Types.ObjectId[];
  createdAt: Date;
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