/* eslint-disable @typescript-eslint/no-explicit-any */
// src\app\(dashboard)\sheikhs\[id]\page.tsx
import { notFound } from "next/navigation";
import { SheikhProfileClient } from "@/components/sheikhs/SheikhProfileClient";
import {
  getGroupsBySheikh,
  getSheikhById,
} from "@/lib/services/sheikh.service";

type SheikhProfileProps = { params: Promise<{ id: string }> };

/**
 * generateMetadata: runs on the server
 * fetches the sheikh's name to put in the page title
 */
export async function generateMetadata({ params }: SheikhProfileProps) {
  const { id } = await params;
  const sheikh = await getSheikhById(id);
  return {
    title: sheikh?.name ?? "الشيخ",
    description: `بيانات ومجموعات ${sheikh?.name ?? "الشيخ"}`,
  };
}

export default async function SheikhProfilePage({
  params,
}: SheikhProfileProps) {
  const { id } = await params;
  const sheikh = await getSheikhById(id);
  const groups = await getGroupsBySheikh(id);
  if (!sheikh) notFound();

  // Serialize
  const data = {
    sheikh: {
      ...sheikh,
      _id: sheikh._id.toString(),
      mosqueId: sheikh.mosqueId.toString(),
      createdAt: sheikh.createdAt.toISOString(),
    },
    groups: groups.map((g) => ({
      _id: g._id.toString(),
      name: g.name,
      activity: g.activity,
      students: (g.studentIds as any[]).map((s: any) => ({
        _id: s._id.toString(),
        name: s.name,
        level: s.level,
        photo: s.photo ?? null,
      })),
    })),
  };

  return <SheikhProfileClient data={data as any} sheikhId={id} />;
}
