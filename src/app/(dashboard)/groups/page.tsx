/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from "@/lib/db/connect";
import Group from "@/models/group.model";
import Sheikh from "@/models/Sheikh";
import { GroupsManager } from "@/components/groups/GroupsManager";
import "@/models/Student";
import { getMosqueId } from "@/lib/auth/get-context";
export const metadata = { title: "المجموعات" };

const ACT_LABELS = {
  quran: "قرآن",
  tarbiya: "تربية",
  tajweed: "تجويد",
  maqraa: "مقرأة",
  playground: "ملعب",
};

export default async function GroupsPage() {
  const mosqueId = await getMosqueId();

  await connectDB();

  const [groups, sheikhs] = await Promise.all([
    Group.find({ mosqueId })
      .populate("sheikhId", "name")
      .populate("studentIds", "name")
      .sort({ activity: 1, name: 1 })
      .lean(),
    Sheikh.find({ mosqueId }).select("name").sort({ name: 1 }).lean(),
  ]);

  const serialized = groups.map((g) => {
    const sheikhData = g.sheikhId as any;

    return {
      _id: g._id.toString(),
      name: g.name,
      activity: g.activity,
      activityLabel:
        ACT_LABELS[g.activity as keyof typeof ACT_LABELS] ?? g.activity,
      sheikh: {
        _id: sheikhData?._id?.toString() ?? "",
        name: sheikhData?.name ?? "شيخ محذوف / غير محدد",
      },
      // 2. تأمين قراءة الطلاب (فلترة أي طالب محذوف راجع بـ null)
      students: (g.studentIds as any[])
        .filter((s) => s != null) // <-- مهم جداً عشان لو في طالب اتمسح
        .map((s) => ({
          _id: s._id?.toString(),
          name: s.name,
        })),
      notes: g.notes,
    };
  });
  // const serialized = groups.map((g) => ({
  //   _id: g._id.toString(),
  //   name: g.name,
  //   activity: g.activity,
  //   activityLabel:
  //     ACT_LABELS[g.activity as keyof typeof ACT_LABELS] ?? g.activity,
  //   sheikh: {
  //     _id: (g.sheikhId as any)._id?.toString(),
  //     name: (g.sheikhId as any).name,
  //   },
  //   students: (g.studentIds as any[]).map((s) => ({
  //     _id: s._id.toString(),
  //     name: s.name,
  //   })),
  //   notes: g.notes,
  // }));

  const serializedSheikhs = sheikhs.map((s) => ({
    _id: s._id.toString(),
    name: s.name,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">المجموعات</h1>
        <p className="text-muted-foreground text-sm">إدارة مجموعات الحلقات</p>
      </div>
      <GroupsManager groups={serialized} sheikhs={serializedSheikhs} />
    </div>
  );
}
