// // // src\app\(dashboard)\dashboard\students\[id]\edit\page.tsx
// import { getStudentById } from "@/lib/data/student.data";
// import { notFound } from "next/navigation";
// import StudentForm from "@/components/students/student-form";

// export const metadata = { title: "تعديل بيانات الطالب" };

// import React from "react";
// type Props = { params: Promise<{ id: string }> };
// export default async function page({ params }: Props) {
//   const { id } = await params;

//   const student = await getStudentById(id);
//   console.log("🚀 ~ EditStudentPage ~ student:", student);
//   if (!student) notFound();

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">
//         تعديل بيانات الطالب: {student.name}
//       </h1>
//       {/* نمرر الـ student كاملاً كـ initialData */}
//       <StudentForm initialData={student} studentId={id} />
//     </div>
//   );
// }

// src/app/(dashboard)/dashboard/students/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import StudentForm from "@/components/students/student-form";
import { getStudentById } from "@/queries/student.queries";

type EditStudentPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EditStudentPageProps) {
  const { id } = await params;
  const student = await getStudentById(id);
  return { title: student ? `تعديل: ${student.name}` : "تعديل بيانات الطالب" };
}

export default async function EditStudentPage({
  params,
}: EditStudentPageProps) {
  const { id } = await params;

  // React cache() deduplicates this DB call with generateMetadata above
  const student = await getStudentById(id);
  if (!student) notFound();

  return (
    <div className="container-form flex flex-col gap-6">
      <h1 className="text-page-title">تعديل بيانات الطالب: {student.name}</h1>
      <StudentForm initialData={student} studentId={id} />
    </div>
  );
}
