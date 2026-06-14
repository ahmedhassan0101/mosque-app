// src/app/(dashboard)/dashboard/groups/[type]/new/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTeachersList } from "@/queries/teacher.queries";
import { getStudentsList } from "@/queries/student.queries";
import GroupForm from "@/components/groups/group-form";
import { ACTIVITIES, type ActivityType } from "@/constants";

type Props = { params: Promise<{ type: string }> };

function assertActivityType(type: string): type is ActivityType {
  return (ACTIVITIES.values as readonly string[]).includes(type);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  if (!assertActivityType(type)) return { title: "غير موجود" };
  return { title: `إضافة ${ACTIVITIES.labels[type]} جديدة` };
}

export default async function NewGroupPage({ params }: Props) {
  const { type } = await params;

  if (!assertActivityType(type)) notFound();

  const [teachers, students] = await Promise.all([
    getTeachersList(),
    getStudentsList(),
  ]);

  const teacherOptions = teachers.map((t) => ({ label: t.name, value: t._id }));
  const studentOptions = students.students.map((s) => ({
    label: s.name,
    value: s._id,
  }));

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-xl font-semibold mb-6">
        إضافة {ACTIVITIES.labels[type]} جديدة
      </h1>
      <GroupForm
        category={type}
        teachers={teacherOptions}
        students={studentOptions}
      />
    </div>
  );
}

// src\app\(dashboard)\dashboard\groups\[type]\new\page.tsx
// import { Metadata } from "next";

// type Props = { params: Promise<{ type: string }> };

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { type } = await params;
//   return { title: `إضافة جديد - ${type}` }; // يمكنك تحويلها لعربي أيضاً
// }

// export default async function NewGroupPage({ params }: Props) {
//   const { type } = await params;

//   return (
//     <div>
//       <h1 className="text-xl mb-6">إضافة مجموعة جديدة في قسم: {type}</h1>
//       {/* <GroupForm defaultType={type} /> */}
//     </div>
//   );
// }

// import { Metadata } from "next";
// import { getGroupLabel } from "@/lib/utils";
// import GroupForm from "@/components/groups/group-form";
// import { getStudentsList } from "@/lib/data/student.data";
// import { getTeachersList } from "@/lib/data/teacher.data";
// type Props = { params: Promise<{ type: string }> };

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { type } = await params;
//   return { title: `إضافة ${getGroupLabel(type)} جديد` };
// }

// export default async function NewGroupPage({ params }: Props) {
//   const { type } = await params;
//   const [teachers, students] = await Promise.all([
//     getTeachersList(),
//     getStudentsList(),
//   ]);

//   // تحويل البيانات لشكل { label, value }
//   const teacherOptions = teachers.map((t) => ({ label: t.name, value: t._id }));
//   const studentOptions = students.map((s) => ({ label: s.name, value: s._id }));
//   return (
//     <div className="max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-8">
//         {/* إنشاء {getGroupLabel(type)} جديد */}
//       </h1>
//       <GroupForm
//         category={type}
//         students={studentOptions}
//         teachers={teacherOptions}
//       />
//     </div>
//   );
// }
