// src/app/(dashboard)/dashboard/teachers/new/page.tsx
import TeacherForm from "@/components/teachers/TeacherForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "إضافة معلم جديد" };

export default function NewTeacherPage() {
  return (
    <div className="container-form flex flex-col gap-6">
      <h1 className="text-page-title">إضافة معلم جديد</h1>
      <TeacherForm />
    </div>
  );
}
