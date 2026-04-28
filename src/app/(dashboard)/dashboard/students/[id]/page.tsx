// src/app/(dashboard)/dashboard/students/[id]/page.tsx
// import { Metadata } from "next";
// import { getStudentById } from "@/lib/data/student.data";
// import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

// 💡 تحسين: جعل العنوان يتغير حسب اسم الطالب
// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { id } = await params;
//   const student = await getStudentById(id);
//   return { title: student ? `ملف: ${student.name}` : "طالب غير موجود" };
// }

export default async function StudentProfilePage({ params }: Props) {
  const { id } = await params;
  // const student = await getStudentById(id);

  // if (!student) notFound();

  return (
    <div>
      {/* <h1 className="text-2xl font-bold">{student.name}</h1> */}
      {/* تفاصيل الطالب هنا */}{" "}
      <p> this is the student profile page for ID: {id} </p>;
    </div>
  );
}
