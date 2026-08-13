// src/app/(dashboard)/dashboard/teachers/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import TeacherForm from "@/components/teachers/TeacherForm";
import { getTeacherById } from "@/queries/teacher.queries";

type EditTeacherPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EditTeacherPageProps) {
  const { id } = await params;
  const teacher = await getTeacherById(id);
  // React cache() ensures this DB call is NOT duplicated in the page below
  return { title: teacher ? `تعديل: ${teacher.name}` : "تعديل المعلم" };
}

export default async function EditTeacherPage({
  params,
}: EditTeacherPageProps) {
  const { id } = await params;

  const teacher = await getTeacherById(id);
  // the type of teacher

  if (!teacher) notFound();

  return (
    <div className="container-form flex flex-col gap-6">
      <h1 className="text-page-title">تعديل بيانات المعلم</h1>
      <TeacherForm initialData={teacher} teacherId={id} />
    </div>
  );
}
