// import { Metadata } from "next";
// import GroupForm from "@/components/groups/group-form";
// import { getGroupById } from "@/lib/data/group.data";

// export const getGroupLabel = (type: string) => {
//   const labels: Record<string, string> = {
//     quran: "حلقات القرآن",
//     tarbiya: "الدروس التربوية",
//     tajweed: "دروس التجويد",
//     maqraa: "المقارئ",
//     playground: "نشاط الملعب",
//   };
//   return labels[type] || "مجموعة دراسية";
// };

// type Props = { params: Promise<{ type: string; id: string }> };

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { type } = await params;
//   return { title: `تعديل ${getGroupLabel(type)}` };
// }

// export default async function EditGroupPage({ params }: Props) {
//   const { id, type } = await params;
//   const group = await getGroupById(id);

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-8">
//         {/* تعديل بيانات {getGroupLabel(type)} */}
//       </h1>
//       <GroupForm initialData={group} groupId={id} category={type} />
//       {/* Type 'Serialize<IGroup> | null' is not assignable to type 'Serialize<IGroup> | undefined'.
//   Type 'null' is not assignable to type 'Serialize<IGroup> | undefined'. */}
//     </div>
//   );
// }
// src/app/(dashboard)/groups/[type]/edit/[id]/page.tsx
import { notFound } from "next/navigation";
import { getGroupById } from "@/lib/data/group.data";
import { getTeachersList } from "@/lib/data/teacher.data";
import { getStudentsList } from "@/lib/data/student.data";
import GroupForm from "@/components/groups/group-form";

type Props = { params: Promise<{ type: string; id: string }> };

export default async function EditGroupPage({ params }: Props) {
  const { id, type } = await params;

  const [group, teachers, students] = await Promise.all([
    getGroupById(id),
    getTeachersList(),
    getStudentsList(),
  ]);

  if (!group || group.activity !== type) {
    notFound();
    // الآن لو كانت حلقة قرآن وكتب في الرابط tarbiya، الصفحة هتديله 404 فوراً ولن تفتح
  }

  // 3. تجهيز القوائم
  const teacherOptions = teachers.map((t) => ({ label: t.name, value: t._id }));
  const studentOptions = students.map((s) => ({ label: s.name, value: s._id }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">تعديل مجموعة: {group.name}</h1>
      <GroupForm
        initialData={group}
        groupId={id}
        category={type}
        teachers={teacherOptions}
        students={studentOptions}
      />
    </div>
  );
}
