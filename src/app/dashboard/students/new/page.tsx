
// src/app/(dashboard)/dashboard/students/new/page.tsx
import StudentForm from "@/components/students/student-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "إضافة طالب جديد" };

export default function NewStudentPage() {
  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-xl font-semibold mb-6">إضافة طالب جديد</h1>
      <StudentForm />
    </div>
  );
}
