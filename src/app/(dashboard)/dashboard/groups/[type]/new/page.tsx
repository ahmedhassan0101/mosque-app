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
import GroupForm from "@/components/groups/group-form";
import { getStudentsList } from "@/lib/data/student.data";
import { getTeachersList } from "@/lib/data/teacher.data";
type Props = { params: Promise<{ type: string }> };

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { type } = await params;
//   return { title: `إضافة ${getGroupLabel(type)} جديد` };
// }

export default async function NewGroupPage({ params }: Props) {
  const { type } = await params;
  const [teachers, students] = await Promise.all([
    getTeachersList(),
    getStudentsList(),
  ]);

  // تحويل البيانات لشكل { label, value }
  const teacherOptions = teachers.map((t) => ({ label: t.name, value: t._id }));
  const studentOptions = students.map((s) => ({ label: s.name, value: s._id }));
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">
        {/* إنشاء {getGroupLabel(type)} جديد */}
      </h1>
      <GroupForm
        category={type}
        students={studentOptions}
        teachers={teacherOptions}
      />
    </div>
  );
}
