import { notFound } from "next/navigation";
import { StudentForm } from "@/components/students/student-form";
import type { StudentFormData } from "@/lib/validations/student";
import { getStudentById } from "@/temp/services/student.service";

export const metadata = { title: "تعديل بيانات الطالب" };

type PageProps = {
  params: Promise<{ id: string }>;
};
export default async function EditStudentPage({ params }: PageProps) {
  const { id } = await params;

  const student = await getStudentById(id);
  if (!student) notFound();

  // const defaultValues: Partial<StudentFormData> = {
  //   name: student.name,
  //   birthDate: student.birthDate ? new Date(student.birthDate) : undefined,
  //   phone: student.phone ?? "",
  //   guardianName: student.guardianName ?? "",
  //   guardianPhone: student.guardianPhone,
  //   guardianPhone2: student.guardianPhone2 ?? "",
  //
  //   address: student.address ?? "",
  //   photo: student.photo ?? "",
  //   level: student.level as StudentFormData["level"],
  //   enrollments: student.enrollments as StudentFormData["enrollments"],
  //   trackIbadah: student.trackIbadah,
  //   currentSurah: student.currentSurah ?? "",
  //   currentAyah: student.currentAyah,
  //   notes: student.notes ?? "",
  // };
  const defaultValues: Partial<StudentFormData> = {
    name: student.name,
    birthDate: student.birthDate ? new Date(student.birthDate) : undefined,
    phone: student.phone ?? "",
    guardianName: student.guardianName ?? "",
    guardianPhone: student.guardianPhone,
    guardianPhone2: student.guardianPhone2 ?? "",
    gender: student.gender as StudentFormData["gender"],
    address: student.address ?? "",
    photo: student.photo ?? "",
    level: student.level as StudentFormData["level"],
    enrollments: student.enrollments as StudentFormData["enrollments"],
    trackIbadah: student.trackIbadah,
    currentSurah: student.currentSurah ?? "",
    currentAyah: student.currentAyah,
    notes: student.notes ?? "",
  };
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">تعديل بيانات الطالب</h1>
        <p className="text-muted-foreground text-sm">{student.name}</p>
      </div>
      <StudentForm defaultValues={defaultValues} studentId={id} />
    </div>
  );
}
