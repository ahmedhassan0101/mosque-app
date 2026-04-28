// // src\app\(dashboard)\dashboard\students\[id]\edit\page.tsx
import { getStudentById } from "@/lib/data/student.data";
import { notFound } from "next/navigation";
import StudentForm from "@/components/students/StudentForm";

export const metadata = { title: "تعديل بيانات الطالب" };

import React from "react";
type Props = { params: Promise<{ id: string }> };
export default async function page({ params }: Props) {
  const { id } = await params;

  const student = await getStudentById(id);
  console.log("🚀 ~ EditStudentPage ~ student:", student);
  if (!student) notFound();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        تعديل بيانات الطالب: {student.name}
      </h1>
      {/* نمرر الـ student كاملاً كـ initialData */}
      <StudentForm initialData={student} studentId={id} />
    </div>
  );
}
