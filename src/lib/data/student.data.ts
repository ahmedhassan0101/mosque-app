/* eslint-disable @typescript-eslint/no-explicit-any */
import { cache } from "react";

import { getMosqueId } from "../auth/get-context";
import { connectDB } from "../db/db";
import Student, { type IStudent } from "@/models/student.model";
import { Serialize } from "@/types/serialized";

export type StudentSerialized = Serialize<IStudent>;

function serializeStudent(doc: any): StudentSerialized | null {
  if (!doc) return null;

  return {
    ...doc,
    _id: doc._id.toString(),
    mosqueId: doc.mosqueId?.toString(),
    groupIdId: doc.groupId?.toString() || undefined,
    // تحويل المصفوفات لضمان عدم وجود ObjectIds
    guardians: doc.guardians?.map((g: any) => ({ ...g })) || [],
    enrollments: [...(doc.enrollments || [])],
    birthDate: doc.birthDate?.toISOString?.() || doc.birthDate,
    createdAt: doc.createdAt?.toISOString?.() || doc.createdAt,
    updatedAt: doc.updatedAt?.toISOString?.() || doc.updatedAt,
  } as StudentSerialized;
}

export const getStudentById = cache(
  async (id: string): Promise<StudentSerialized | null> => {
    try {
      await connectDB();
      const mosqueId = await getMosqueId();
      console.log("🚀 ~ mosqueId:", mosqueId);

      const student = await Student.findOne({ _id: id, mosqueId }).lean();
      console.log("🚀 ~ student:", student);

      return serializeStudent(student);
    } catch (error) {
      console.error("[Data Fetching Error - getStudentById]:", error);
      return null;
    }
  },
);

export const getStudentsList = cache(async (): Promise<StudentSerialized[]> => {
  try {
    await connectDB();
    const mosqueId = await getMosqueId();

    const students = await Student.find({ mosqueId }).sort({ name: 1 }).lean();
    return students
      .map(serializeStudent)
      .filter(Boolean) as StudentSerialized[];
  } catch (error) {
    console.error("[Data Fetching Error - getStudentsList]:", error);
    return [];
  }
});

export const getStudentProfile = cache(async (id: string) => {
  try {
    const student = await getStudentById(id);
    if (!student) return null;

    return {
      student,
      attendance: [], // سيتم ربطها لاحقاً
      scores: [], // سيتم ربطها لاحقاً
    };
  } catch (error) {
    console.error("[Data Fetching Error - getStudentProfile]:", error);
    return null;
  }
});
