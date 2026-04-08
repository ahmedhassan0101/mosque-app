import { SheikhsClient } from "@/components/sheikhs/SheikhsClient";
import type { SheikhWithGroups } from "@/types";
import { getGroupsList, getSheikhsList } from "@/lib/services/sheikh.service";

export const metadata = { title: "إدارة المشايخ" };

export default async function SheikhsPage() {
  const sheikhs = await getSheikhsList();
  const groups = await getGroupsList();

  const formattedSheikhs: SheikhWithGroups[] = sheikhs.map((s) => {
    const sheikhGroups = groups.filter(
      (g) => g.sheikhId?.toString() === s._id.toString(),
    );

    return {
      _id: s._id.toString(),
      name: s.name,
      phone: s.phone ?? undefined,
      photo: s.photo ?? undefined,
      groups: sheikhGroups.map((g) => ({
        _id: g._id.toString(),
        name: g.name,
        activity: g.activity,
        studentCount: Array.isArray(g.studentIds) ? g.studentIds.length : 0,
      })),
    };
  });

  return <SheikhsClient sheikhs={formattedSheikhs} />;
}
