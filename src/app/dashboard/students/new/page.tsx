// src/app/(dashboard)/dashboard/students/new/page.tsx
import StudentForm from "@/components/students/student-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "إضافة طالب جديد" };

export default function NewStudentPage() {
  return (
    <div className="container-form flex flex-col gap-6">
      <h1 className="text-page-title">إضافة طالب جديد</h1>
      <StudentForm />
    </div>
  );
}
