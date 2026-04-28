// // src/app/(dashboard)/dashboard/students/new/page.tsx
import { Metadata } from "next";
import  StudentForm  from "@/components/students/StudentForm";

export const metadata: Metadata = { title: "إضافة طالب جديد" };


export default async function  NewStudentPage() {
  return (
    <div>
      page//{" "}
      <div className="max-w-4xl mx-auto p-6">
        564
        <h1 className="text-2xl font-bold mb-6">إضافة طالب جديد</h1>
        {/* نمرر الـ student كاملاً كـ initialData */}
        <StudentForm  />
      </div>
      ;
    </div>
  );
}
