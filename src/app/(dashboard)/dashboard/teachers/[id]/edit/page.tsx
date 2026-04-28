// src\app\(dashboard)\dashboard\teachers\[id]\edit\page.tsx
import TeacherForm from "@/components/teacher/teacher-form";
import { getTeacherById } from "@/lib/data/teacher.data";
import { notFound } from "next/navigation";

export const metadata = { title: "تعديل بيانات المعلم" };

type EditTeacherPageProps = { params: Promise<{ id: string }> };

export default async function EditTeacherPage({
  params,
}: EditTeacherPageProps) {
  const { id } = await params;
  const teacher = await getTeacherById(id);
  // the type of teacher


  if (!teacher) notFound();

  return <TeacherForm initialData={teacher} teacherId={id} />;
}
