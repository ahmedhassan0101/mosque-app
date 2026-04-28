/* eslint-disable @typescript-eslint/no-explicit-any */

// src\lib\data\teacher.data.ts
import { cache } from "react";
import { getMosqueId } from "../auth/get-context";
import { connectDB } from "../db/db";
import Teacher, { type ITeacher } from "@/models/teacher.mode";

import { Serialize } from "@/types/serialized";

export type TeacherSerialized = Serialize<ITeacher>;

function serializeTeacher(doc: any): TeacherSerialized | null {
  if (!doc) return null;

  return {
    ...doc,
    _id: doc._id.toString(),
    mosqueId: doc.mosqueId?.toString(),
    groupIds: Array.isArray(doc.groupIds)
      ? doc.groupIds.map((id: any) => id.toString())
      : [],
    createdAt: doc.createdAt?.toISOString?.() || doc.createdAt,
    updatedAt: doc.updatedAt?.toISOString?.() || doc.updatedAt,
  } as TeacherSerialized;
}

export const getTeacherById = cache(
  async (id: string): Promise<TeacherSerialized | null> => {
    try {
      await connectDB();
      const mosqueId = await getMosqueId();

      const teacher = await Teacher.findOne({ _id: id, mosqueId }).lean();

      if (!teacher) return null;

      return serializeTeacher(teacher);
    } catch (error) {
      console.error("[Data Fetching Error - getTeacherById]:", error);
      return null;
    }
  },
);

// 1. جلب قائمة المعلمين
export const getTeachersList = cache(async (): Promise<TeacherSerialized[]> => {
  try {
    await connectDB();
    const mosqueId = await getMosqueId();

    const teachers = await Teacher.find({ mosqueId }).sort({ name: 1 }).lean();
    return teachers
      .map(serializeTeacher)
      .filter(Boolean) as TeacherSerialized[];
  } catch (error) {
    console.error("[Data Fetching Error - getTeachersList]:", error);
    return [];
  }
});

// export const getTeacherProfile = cache(
//   async (
//     id: string,
//   ): Promise<{ teacher: TeacherSerialized; groups: any[] } | null> => {
//     try {
//       await connectDB();
//       const mosqueId = await getMosqueId();
//       const teacher = await Teacher.findOne({ _id: id, mosqueId }).lean();

//       if (!teacher) return null;

//       return {
//         teacher: serializeTeacher(teacher),
//         groups: [],
//       };
//     } catch (error) {
//       console.error("[Data Fetching Error - getTeacherProfile]:", error);
//       return null;
//     }
//   },
// );

export const getTeacherProfile = cache(async (id: string) => {
  try {
    const teacher = await getTeacherById(id);
    if (!teacher) return null;

    return {
      teacher, // النوع هنا تلقائياً TeacherSerialized
      groups: [], // TODO: fetch groups for this teacher
    };
  } catch (error) {
    console.error("[Data Fetching Error - getTeacherProfile]:", error);
    return null;
  }
});
