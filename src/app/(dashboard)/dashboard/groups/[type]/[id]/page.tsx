import { Metadata } from "next";
import { getGroupById } from "@/lib/data/group.data";

import { notFound } from "next/navigation";
export const getGroupLabel = (type: string) => {
  const labels: Record<string, string> = {
    quran: "حلقات القرآن",
    tarbiya: "الدروس التربوية",
    tajweed: "دروس التجويد",
    maqraa: "المقارئ",
    playground: "نشاط الملعب",
  };
  return labels[type] || "مجموعة دراسية";
};
type Props = { params: Promise<{ type: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, id } = await params;
  const group = await getGroupById(id);
  return {
    title: `${group?.name || "تفاصيل المجموعة"} - ${getGroupLabel(type)}`,
  };
}

export default async function GroupDetailsPage({ params }: Props) {
  const { id, type } = await params;
  const group = await getGroupById(id);

  // 🛡️ الحماية هنا: لو المجموعة مش موجودة، أو نوعها لا يطابق الرابط
  if (!group || group.activity !== type) {
    notFound();
    // الآن لو كانت حلقة قرآن وكتب في الرابط tarbiya، الصفحة هتديله 404 فوراً ولن تفتح
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{group.name}</h1>
        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
          {getGroupLabel(type)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* كروت المعلومات: المعلم، العدد، الموعد */}
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <p className="text-gray-500 text-sm">المعلم المسؤول</p>
          <p className="font-medium text-lg">{group.teacherId}</p>
        </div>
        {/* ... */}
      </div>

      <div className="border rounded-lg bg-white">
        <div className="p-4 border-b font-bold">قائمة الطلاب المقيدين</div>
        {/* جدول الطلاب هنا */}
      </div>
    </div>
  );
}
