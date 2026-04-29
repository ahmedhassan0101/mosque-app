import { Metadata } from "next";

export const getTitleByType = (type: string) => {
  const titles: Record<string, string> = {
    quran: "حلقات القرآن",
    tarbiya: "جلسات التربية",
    tajweed: "دروس التجويد",
    maqraa: "المقرأة",
    playground: "الملعب",
  };
  return titles[type] || "المجموعات";
};

type Props = { params: Promise<{ type: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  return { title: getTitleByType(type) };
}

export default async function GroupsPage({ params }: Props) {
  const { type } = await params;
  const title = getTitleByType(type);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {/* هنا نضع جدول المجموعات ونمرر له الـ type كـ Filter */}
      {/* <GroupsTable type={type} /> */}
    </div>
  );
}
