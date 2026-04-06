// // src/app/(dashboard)/students/[id]/edit/page.tsx
// import { auth } from "@/lib/auth/options";
// import { connectDB } from "@/lib/db/connect";
// import Student from "@/models/Student";
// import { notFound } from "next/navigation";
// import { StudentForm } from "@/components/students/StudentForm";
// import type { StudentFormData } from "@/lib/validations/student";

// export default async function EditStudentPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const session = await auth();
//   const mosqueId = session?.user.mosqueId;
//   if (!mosqueId) return null;

//   await connectDB();

//   const student = await Student.findOne({ _id: params.id, mosqueId }).lean();

//   if (!student) notFound();

//   // نحوّل الـ MongoDB document لـ plain object يتناسب مع الفورم
//   const defaultValues: Partial<StudentFormData> = {
//     name: student.name,
//     birthDate: student.birthDate,
//     phone: student.phone ?? "",
//     guardianName: student.guardianName ?? "",
//     guardianPhone: student.guardianPhone,
//     guardianPhone2: student.guardianPhone2 ?? "",
//     address: student.address ?? "",
//     level: student.level as StudentFormData["level"],
//     enrollments: student.enrollments as StudentFormData["enrollments"],
//     trackIbadah: student.trackIbadah,
//     currentSurah: student.currentSurah ?? "",
//     currentAyah: student.currentAyah,
//     notes: student.notes ?? "",
//   };

//   return (
//     <div className="max-w-2xl mx-auto space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold">تعديل بيانات الطالب</h1>
//         <p className="text-muted-foreground text-sm">{student.name}</p>
//       </div>
//       <StudentForm defaultValues={defaultValues} studentId={params.id} />
//     </div>
//   );
// }

import { auth } from "@/lib/auth/options";
import { connectDB } from "@/lib/db/connect";
import Student from "@/models/Student";
import { notFound } from "next/navigation";
import { StudentForm } from "@/components/students/StudentForm";
import type { StudentFormData } from "@/lib/validations/student";

export const metadata = { title: "تعديل بيانات الطالب" };

type PageProps = {
  params: Promise<{ id: string }>;
};
export default async function EditStudentPage({
  params,
}: PageProps) {
  const { id } = await params;
  const session = await auth();
  const mosqueId = session?.user.mosqueId;
  if (!mosqueId) return null;

  await connectDB();
  const student = await Student.findOne({ _id: id, mosqueId }).lean();

  if (!student) notFound();

  // تحويل الـ MongoDB doc لـ StudentFormData
  const defaultValues: Partial<StudentFormData> = {
    name: student.name,
    birthDate: student.birthDate ? new Date(student.birthDate) : undefined,
    phone: student.phone ?? "",
    guardianName: student.guardianName ?? "",
    guardianPhone: student.guardianPhone,
    guardianPhone2: student.guardianPhone2 ?? "",
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
