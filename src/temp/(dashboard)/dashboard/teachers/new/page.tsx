// src/app/(dashboard)/dashboard/teachers/new/page.tsx
import TeacherForm from "@/components/teachers/TeacherForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "إضافة معلم جديد" };

export default function NewTeacherPage() {
  return (
    <div className="max-w-xl mx-auto py-6">
      <h1 className="text-xl font-semibold mb-6">إضافة معلم جديد</h1>
      <TeacherForm />
    </div>
  );
}
